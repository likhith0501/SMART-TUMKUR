"""
Persistence layer for Smart Civic - Tumakuru.

Design goals:
- Use Supabase (Postgres) when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set.
- Fall back to the original local JSON files when Supabase is not configured,
  so local development keeps working exactly as before.

The Supabase backend stores each JSON collection as a single row in the
`civic_store` table (key = collection name, value = jsonb array). This keeps
the exact same load/save semantics the API already relies on while giving us a
real, persistent, cloud database on Render/Supabase.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

_client = None
_client_checked = False


def _get_client():
    """Return a cached Supabase client, or None if not configured."""
    global _client, _client_checked
    if _client_checked:
        return _client
    _client_checked = True
    url = os.environ.get("SUPABASE_URL", "").strip()
    key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
        or os.environ.get("SUPABASE_KEY", "").strip()
    )
    if url and key:
        try:
            from supabase import create_client

            _client = create_client(url, key)
        except Exception as exc:  # pragma: no cover - defensive
            print(f"[db] Supabase client init failed, falling back to JSON: {exc}")
            _client = None
    return _client


def is_remote() -> bool:
    return _get_client() is not None


def _table_name(filepath: str) -> str:
    return os.path.splitext(os.path.basename(filepath))[0]


def load_data(filepath: str, default: Optional[list] = None) -> list:
    if default is None:
        default = []
    client = _get_client()
    if client is not None:
        try:
            resp = (
                client.table("civic_store")
                .select("value")
                .eq("key", _table_name(filepath))
                .execute()
            )
            if resp.data:
                return resp.data[0].get("value") or default
            return default
        except Exception as exc:  # pragma: no cover - defensive
            print(f"[db] load_data remote failed for {filepath}: {exc}")
            return default

    # Local JSON fallback
    if not os.path.exists(filepath):
        return default
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save_data(filepath: str, data: list) -> None:
    client = _get_client()
    if client is not None:
        try:
            client.table("civic_store").upsert(
                {
                    "key": _table_name(filepath),
                    "value": data,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
            ).execute()
            return
        except Exception as exc:  # pragma: no cover - defensive
            print(f"[db] save_data remote failed for {filepath}: {exc}")
            return

    # Local JSON fallback
    os.makedirs(os.path.dirname(filepath) or ".", exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def save_upload(data: bytes, filename: str, bucket: str = "complaints") -> str:
    """
    Persist an uploaded file.

    Remote (Supabase Storage): uploads to the given public bucket and returns
    an absolute public URL.
    Local: writes into the backend `uploads/` directory and returns a public
    URL built from PUBLIC_BASE_URL (falls back to http://localhost:8000).
    """
    safe_name = f"{uuid.uuid4().hex[:8]}_{os.path.basename(filename)}"

    client = _get_client()
    if client is not None:
        try:
            client.storage.from_(bucket).upload(
                safe_name,
                data,
                {"content-type": _guess_content_type(filename), "upsert": "true"},
            )
            public_url = client.storage.from_(bucket).get_public_url(safe_name)
            # supabase-py returns a response object or a string depending on version
            url = getattr(public_url, "value", None) or str(public_url)
            return url
        except Exception as exc:  # pragma: no cover - defensive
            print(f"[db] storage upload failed: {exc}")

    # Local fallback
    base = os.environ.get("PUBLIC_BASE_URL", "http://localhost:8000").rstrip("/")
    uploads_dir = os.environ.get(
        "UPLOAD_DIR", os.path.join(os.path.dirname(__file__), "uploads")
    )
    os.makedirs(uploads_dir, exist_ok=True)
    with open(os.path.join(uploads_dir, safe_name), "wb") as f:
        f.write(data)
    return f"{base}/uploads/{safe_name}"


def _guess_content_type(filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    return {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".mp4": "video/mp4",
        ".webm": "video/webm",
    }.get(ext, "application/octet-stream")


def _as_dict(value: Any) -> Optional[dict]:
    return value if isinstance(value, dict) else None
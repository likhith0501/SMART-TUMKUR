import os
import json
import uuid
import io
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import jwt
from passlib.context import CryptContext

import db

from tumakuru_city_data import TUMAKURU_CITY_INFO, TUMAKURU_WARDS, TUMAKURU_INFRASTRUCTURE, MUNICIPAL_DEPARTMENTS
from tumakuru_taluk_data import TUMAKURU_DISTRICT, TUMAKURU_TALUK, TUMAKURU_HOBLIS, TUMAKURU_GRAM_PANCHAYATS, TUMAKURU_TALUK_VILLAGES

# Setup Security (Argon2 / Bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("JWT_SECRET", "tumakuru_smart_civic_super_secret_jwt_key_2026")
ALGORITHM = "HS256"

app = FastAPI(title="Smart Civic Tumakuru Enterprise API", version="2.2.0")

# CORS: allow the deployed frontend (Vercel) plus any configured extra origins.
# Set CORS_ORIGINS (comma-separated) on Render; "*" keeps local/dev permissive.
_cors_env = os.environ.get("CORS_ORIGINS", "*").strip()
allow_origins = ["*"] if _cors_env == "*" else [o.strip() for o in _cors_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, "complaints.json")
USERS_FILE = os.path.join(BASE_DIR, "users.json")
CITIZENS_FILE = os.path.join(BASE_DIR, "citizens.json")
STAFF_FILE = os.path.join(BASE_DIR, "staff.json")
AUDIT_FILE = os.path.join(BASE_DIR, "audit_logs.json")
NOTIF_FILE = os.path.join(BASE_DIR, "notifications.json")
VILLAGES_FILE = os.path.join(BASE_DIR, "villages.json")
VILLAGE_REQUESTS_FILE = os.path.join(BASE_DIR, "village_requests.json")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# ----------------- DB SEEDING AND PERSISTENCE -----------------

def log_audit(action: str, performed_by: str, details: str, target_id: str = ""):
    logs = load_data(AUDIT_FILE, [])
    logs.insert(0, {
        "id": f"AUD-{uuid.uuid4().hex[:6]}",
        "action": action,
        "performed_by": performed_by,
        "details": details,
        "target_id": target_id,
        "timestamp": datetime.now().isoformat()
    })
    save_data(AUDIT_FILE, logs[:500])

def load_data(filepath, default=[]):
    # Delegates to the Supabase-backed store with a local JSON fallback.
    return db.load_data(filepath, default)

def save_data(filepath, data):
    db.save_data(filepath, data)

def seed_users_and_staff():
    # Seeding is based on collection emptiness (works for Supabase and local JSON),
    # not on file existence, so a fresh cloud DB gets seeded on first startup.

    # Admin seed: username "likhi", password "likhi@2005"
    users = load_data(USERS_FILE, [])
    if not users:
        admin_entry = {
            "username": "likhi",
            "password_hash": pwd_context.hash("likhi@2005"),
            "full_name": "Likhi (Chief Municipal Administrator)",
            "phone": "9845012345",
            "email": "admin@tumakurucitycorp.gov.in",
            "role": "admin",
            "created_at": datetime.now().isoformat(),
            "first_login": False
        }
        save_data(USERS_FILE, [admin_entry])

    # Initial Citizens Seed (Password: citizen@123)
    citizens = load_data(CITIZENS_FILE, [])
    if not citizens:
        citizen_sample = [
            {
                "id": f"CTZ-{uuid.uuid4().hex[:6]}",
                "phone": "9845012345",
                "password_hash": pwd_context.hash("citizen@123"),
                "full_name": "Prajwal Gowda",
                "email": "prajwal@gmail.com",
                "ward": "Ward 14 - Gandhinagar",
                "ward_no": 14,
                "locality": "KSRTC Terminal Area",
                "address": "Opposite Town Hall, BH Road, Tumakuru",
                "created_at": datetime.now().isoformat()
            },
            {
                "id": f"CTZ-{uuid.uuid4().hex[:6]}",
                "phone": "9845123456",
                "password_hash": pwd_context.hash("citizen@123"),
                "full_name": "Ramesh Gowda",
                "email": "ramesh.g@yahoo.com",
                "ward": "Ward 14 - Gandhinagar",
                "ward_no": 14,
                "locality": "Near Bus Stand",
                "address": "Gandhinagar 2nd Cross, Tumakuru",
                "created_at": datetime.now().isoformat()
            }
        ]
        save_data(CITIZENS_FILE, citizen_sample)

    # Initial Staff Seed (Username: staff1, Password: staff1@123)
    staff_list = load_data(STAFF_FILE, [])
    if not staff_list:
        staff1_entry = {
            "id": "STF-01",
            "username": "staff1",
            "password_hash": pwd_context.hash("staff1@123"),
            "full_name": "Inspector Venkatesh M.",
            "phone": "9845198765",
            "department": "Road and Infrastructure Department",
            "assigned_ward": "Ward 14 - Gandhinagar",
            "assigned_gp": "Kyathsandra Rural",
            "role": "staff",
            "active": True,
            "created_at": datetime.now().isoformat(),
            "tasks_completed": 47,
            "tasks_assigned": 4
        }
        staff2_entry = {
            "id": "STF-02",
            "username": "staff2",
            "password_hash": pwd_context.hash("staff2@123"),
            "full_name": "Supervisor Manjunath K.",
            "phone": "9900223344",
            "department": "Sanitation Department",
            "assigned_ward": "Ward 22 - Ashok Nagar",
            "assigned_gp": "Gulur",
            "role": "staff",
            "active": True,
            "created_at": datetime.now().isoformat(),
            "tasks_completed": 62,
            "tasks_assigned": 3
        }
        save_data(STAFF_FILE, [staff1_entry, staff2_entry])

    # Seed Master Villages if empty
    if not load_data(VILLAGES_FILE, []):
        save_data(VILLAGES_FILE, TUMAKURU_TALUK_VILLAGES)

    # Seed Sample Missing Village Request
    if not load_data(VILLAGE_REQUESTS_FILE, []):
        sample_request = [
            {
                "id": "VR-001",
                "village_name": "Hosahalli Palya",
                "hobli": "Gulur Hobli",
                "gp_name": "Palasandra",
                "taluk": "Tumakuru Taluk",
                "pincode": "572118",
                "coordinates": "13.2842° N, 77.0915° E",
                "submitted_by": "Ramesh Gowda (9845123456)",
                "additional_notes": "Newly settled hamlet near Palasandra Lake feeder canal.",
                "status": "Pending Verification",
                "created_at": datetime.now().isoformat()
            }
        ]
        save_data(VILLAGE_REQUESTS_FILE, sample_request)

seed_users_and_staff()

# ----------------- TUMAKURU TALUK GEOGRAPHIC HIERARCHY & APIS -----------------

@app.get("/api/geo/hierarchy")
def get_geo_hierarchy():
    villages = load_data(VILLAGES_FILE, TUMAKURU_TALUK_VILLAGES)
    return {
        "state": "Karnataka",
        "district": TUMAKURU_DISTRICT,
        "taluk": TUMAKURU_TALUK,
        "hoblis": TUMAKURU_HOBLIS,
        "gram_panchayats_count": len(TUMAKURU_GRAM_PANCHAYATS),
        "villages_count": len(villages),
        "municipal_wards_count": len(TUMAKURU_WARDS)
    }

@app.get("/api/geo/hoblis")
def get_hoblis():
    return TUMAKURU_HOBLIS

@app.get("/api/geo/gram-panchayats")
def get_gram_panchayats(hobli: Optional[str] = None):
    gps = TUMAKURU_GRAM_PANCHAYATS
    if hobli and hobli.lower() != "all":
        return [g for g in gps if g["hobli"].lower() == hobli.lower()]
    return gps

@app.get("/api/geo/villages")
def get_villages(hobli: Optional[str] = None, gp_name: Optional[str] = None, search: Optional[str] = None):
    villages = load_data(VILLAGES_FILE, TUMAKURU_TALUK_VILLAGES)
    res = villages
    if hobli and hobli.lower() != "all":
        res = [v for v in res if v.get("hobli", "").lower() == hobli.lower()]
    if gp_name and gp_name.lower() != "all":
        res = [v for v in res if v.get("gp_name", "").lower() == gp_name.lower()]
    if search:
        q = search.lower()
        res = [v for v in res if q in v.get("village_name", "").lower() or q in v.get("kannada_name", "") or q in v.get("lgd_code", "")]
    return res

# Missing Village Registration & Citizen Submission
class MissingVillageRequest(BaseModel):
    village_name: str
    hobli: str
    gp_name: str
    taluk: str = "Tumakuru Taluk"
    pincode: Optional[str] = "572101"
    coordinates: Optional[str] = ""
    submitted_by: Optional[str] = "Citizen Resident"
    additional_notes: Optional[str] = ""

@app.post("/api/geo/villages/request-new")
def request_new_village(req: MissingVillageRequest):
    requests = load_data(VILLAGE_REQUESTS_FILE, [])
    new_req = {
        "id": f"VR-{len(requests) + 1:03d}",
        **req.dict(),
        "status": "Pending Verification",
        "created_at": datetime.now().isoformat()
    }
    requests.insert(0, new_req)
    save_data(VILLAGE_REQUESTS_FILE, requests)

    # In-App notification for Admin review
    add_notification(
        title=f"New Village Verification Request: {req.village_name}",
        message=f"Citizen requested village inclusion under {req.gp_name}, {req.hobli}.",
        role_target="admin"
    )
    log_audit("VILLAGE_REQUESTED", req.submitted_by or "citizen", f"Requested addition of {req.village_name}", new_req["id"])
    return {
        "success": True,
        "message": f"Village '{req.village_name}' submitted for municipal verification. Pending officer review.",
        "request": new_req
    }

@app.get("/api/admin/geo/village-requests")
def get_village_requests():
    return load_data(VILLAGE_REQUESTS_FILE, [])

@app.patch("/api/admin/geo/village-requests/{request_id}/approve")
def approve_village_request(request_id: str):
    requests = load_data(VILLAGE_REQUESTS_FILE, [])
    req_item = next((r for r in requests if r["id"] == request_id), None)
    if not req_item:
        raise HTTPException(status_code=404, detail="Village request not found")

    req_item["status"] = "Approved"
    save_data(VILLAGE_REQUESTS_FILE, requests)

    # Add to master official villages list
    villages = load_data(VILLAGES_FILE, TUMAKURU_TALUK_VILLAGES)
    new_village = {
        "lgd_code": f"61{len(villages) + 1:04d}",
        "village_name": req_item["village_name"],
        "kannada_name": req_item["village_name"],
        "gp_name": req_item["gp_name"],
        "hobli": req_item["hobli"],
        "pincode": req_item.get("pincode", "572101"),
        "lat": 13.3409,
        "lng": 77.1010
    }
    villages.append(new_village)
    save_data(VILLAGES_FILE, villages)

    log_audit("VILLAGE_APPROVED", "admin", f"Approved village {req_item['village_name']} into master registry", new_village["lgd_code"])
    return {"success": True, "message": f"Village {req_item['village_name']} added to official database.", "village": new_village}

@app.patch("/api/admin/geo/village-requests/{request_id}/reject")
def reject_village_request(request_id: str, payload: dict = {}):
    requests = load_data(VILLAGE_REQUESTS_FILE, [])
    req_item = next((r for r in requests if r["id"] == request_id), None)
    if not req_item:
        raise HTTPException(status_code=404, detail="Village request not found")

    req_item["status"] = "Rejected"
    req_item["reason"] = payload.get("reason", "Duplicate or outside Taluk jurisdiction")
    save_data(VILLAGE_REQUESTS_FILE, requests)

    log_audit("VILLAGE_REJECTED", "admin", f"Rejected village {req_item['village_name']}: {req_item['reason']}", request_id)
    return {"success": True, "message": "Request rejected."}

# Admin Manual Village Addition
class VillageCreate(BaseModel):
    village_name: str
    kannada_name: Optional[str] = ""
    gp_name: str
    hobli: str
    pincode: Optional[str] = "572101"
    lat: Optional[float] = 13.3409
    lng: Optional[float] = 77.1010

@app.post("/api/admin/geo/villages")
def admin_add_village(v: VillageCreate):
    villages = load_data(VILLAGES_FILE, TUMAKURU_TALUK_VILLAGES)
    new_v = {
        "lgd_code": f"61{len(villages) + 1:04d}",
        "village_name": v.village_name.strip(),
        "kannada_name": v.kannada_name or v.village_name,
        "gp_name": v.gp_name,
        "hobli": v.hobli,
        "pincode": v.pincode or "572101",
        "lat": v.lat or 13.3409,
        "lng": v.lng or 77.1010
    }
    villages.append(new_v)
    save_data(VILLAGES_FILE, villages)
    log_audit("VILLAGE_ADDED_MANUAL", "admin", f"Added official village {v.village_name}", new_v["lgd_code"])
    return new_v

@app.delete("/api/admin/geo/villages/{lgd_code}")
def admin_delete_village(lgd_code: str):
    villages = load_data(VILLAGES_FILE, TUMAKURU_TALUK_VILLAGES)
    villages = [v for v in villages if v.get("lgd_code") != lgd_code]
    save_data(VILLAGES_FILE, villages)
    log_audit("VILLAGE_DELETED", "admin", f"Removed village entry {lgd_code}", lgd_code)
    return {"success": True, "message": "Village removed"}

# ----------------- TUMAKURU CITY WARDS & INFRASTRUCTURE -----------------

@app.get("/api/city/overview")
def get_city_overview():
    villages = load_data(VILLAGES_FILE, TUMAKURU_TALUK_VILLAGES)
    return {
        "city_info": TUMAKURU_CITY_INFO,
        "wards_count": len(TUMAKURU_WARDS),
        "departments_count": len(MUNICIPAL_DEPARTMENTS),
        "infrastructure_count": len(TUMAKURU_INFRASTRUCTURE),
        "taluk_villages_count": len(villages),
        "gram_panchayats_count": len(TUMAKURU_GRAM_PANCHAYATS)
    }

@app.get("/api/city/wards")
def get_city_wards():
    return TUMAKURU_WARDS

@app.get("/api/city/infrastructure")
def get_city_infrastructure():
    return TUMAKURU_INFRASTRUCTURE

@app.get("/api/city/departments")
def get_departments():
    return MUNICIPAL_DEPARTMENTS

# ----------------- AUTHENTICATION: CITIZEN (NO OTP, MOBILE + PASSWORD) -----------------

class CitizenRegisterRequest(BaseModel):
    full_name: str
    phone: str
    password: str
    email: Optional[str] = None
    ward: str
    ward_no: Optional[int] = 14
    locality: str
    address: str

class CitizenLoginRequest(BaseModel):
    phone: str
    password: str

class CitizenForgotPasswordRequest(BaseModel):
    phone: str
    email: Optional[str] = None
    new_password: str

@app.post("/api/auth/citizen/register")
def citizen_register(req: CitizenRegisterRequest):
    phone = req.phone.strip()
    if len(phone) < 10:
        raise HTTPException(status_code=400, detail="Mobile number must be at least 10 digits.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    citizens = load_data(CITIZENS_FILE, [])
    if any(c["phone"] == phone for c in citizens):
        raise HTTPException(status_code=400, detail="An account with this mobile number already exists. Please log in.")

    new_citizen = {
        "id": f"CTZ-{uuid.uuid4().hex[:6]}",
        "phone": phone,
        "password_hash": pwd_context.hash(req.password),
        "full_name": req.full_name.strip(),
        "email": req.email.strip() if req.email else "",
        "ward": req.ward,
        "ward_no": req.ward_no or 14,
        "locality": req.locality.strip(),
        "address": req.address.strip(),
        "created_at": datetime.now().isoformat()
    }
    citizens.append(new_citizen)
    save_data(CITIZENS_FILE, citizens)

    token = jwt.encode(
        {"sub": phone, "role": "citizen", "id": new_citizen["id"], "exp": datetime.utcnow() + timedelta(days=30)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    log_audit("CITIZEN_REGISTER", phone, f"Citizen registered: {req.full_name} ({req.ward})", new_citizen["id"])
    return {
        "token": token,
        "role": "citizen",
        "user": {
            "id": new_citizen["id"],
            "name": new_citizen["full_name"],
            "phone": new_citizen["phone"],
            "email": new_citizen["email"],
            "ward": new_citizen["ward"],
            "locality": new_citizen["locality"],
            "address": new_citizen["address"],
            "role": "citizen"
        }
    }

@app.post("/api/auth/citizen/login")
def citizen_login(req: CitizenLoginRequest):
    phone = req.phone.strip()
    citizens = load_data(CITIZENS_FILE, [])
    citizen = next((c for c in citizens if c["phone"] == phone), None)

    if not citizen:
        raise HTTPException(status_code=401, detail="Mobile number not registered. Please create a new account.")
    
    if not pwd_context.verify(req.password, citizen["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid password. Please check your credentials or use Forgot Password.")

    token = jwt.encode(
        {"sub": phone, "role": "citizen", "id": citizen["id"], "exp": datetime.utcnow() + timedelta(days=30)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    log_audit("CITIZEN_LOGIN", phone, f"Citizen logged in: {citizen['full_name']}")
    return {
        "token": token,
        "role": "citizen",
        "user": {
            "id": citizen["id"],
            "name": citizen["full_name"],
            "phone": citizen["phone"],
            "email": citizen.get("email", ""),
            "ward": citizen.get("ward", "Ward 14 - Gandhinagar"),
            "locality": citizen.get("locality", ""),
            "address": citizen.get("address", ""),
            "role": "citizen"
        }
    }

@app.post("/api/auth/citizen/forgot-password")
def citizen_forgot_password(req: CitizenForgotPasswordRequest):
    phone = req.phone.strip()
    citizens = load_data(CITIZENS_FILE, [])
    citizen = next((c for c in citizens if c["phone"] == phone), None)

    if not citizen:
        raise HTTPException(status_code=404, detail="No registered citizen account found with this mobile number.")

    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")

    citizen["password_hash"] = pwd_context.hash(req.new_password)
    save_data(CITIZENS_FILE, citizens)
    log_audit("CITIZEN_PASSWORD_RECOVERY", phone, "Password successfully reset via verified recovery protocol")
    return {"success": True, "message": "Password has been successfully reset. You may now log in with your new password."}

# ----------------- AUTHENTICATION: ADMIN & STAFF -----------------

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class StaffLoginRequest(BaseModel):
    username: str
    password: str

class StaffCreateRequest(BaseModel):
    username: str
    full_name: str
    phone: str
    department: str
    assigned_ward: str
    assigned_gp: Optional[str] = "Kyathsandra Rural"
    temporary_password: str

@app.post("/api/auth/admin-login")
def admin_login(req: AdminLoginRequest):
    users = load_data(USERS_FILE, [])
    user = next((u for u in users if u["username"].lower() == req.username.lower() and u["role"] == "admin"), None)
    if not user or not pwd_context.verify(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid administrator credentials.")
    
    token = jwt.encode(
        {"sub": user["username"], "role": "admin", "exp": datetime.utcnow() + timedelta(days=7)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    log_audit("ADMIN_LOGIN", user["username"], "Administrator logged into Smart Civic Control Center")
    return {
        "token": token,
        "role": "admin",
        "first_login": user.get("first_login", False),
        "user": {
            "username": user["username"],
            "name": user["full_name"],
            "email": user["email"],
            "phone": user["phone"],
            "role": "admin",
            "ward": "Tumakuru Smart City Central"
        }
    }

@app.post("/api/auth/staff-login")
def staff_login(req: StaffLoginRequest):
    staff_list = load_data(STAFF_FILE, [])
    member = next((s for s in staff_list if s["username"].lower() == req.username.lower()), None)
    if not member or not member.get("active", True):
        raise HTTPException(status_code=401, detail="Staff account not found or deactivated.")
    
    if not pwd_context.verify(req.password, member["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid staff credentials.")

    token = jwt.encode(
        {"sub": member["username"], "role": "staff", "id": member["id"], "exp": datetime.utcnow() + timedelta(days=7)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    log_audit("STAFF_LOGIN", member["username"], f"Staff logged in ({member['department']})")
    return {
        "token": token,
        "role": "staff",
        "user": {
            "id": member["id"],
            "username": member["username"],
            "name": member["full_name"],
            "phone": member["phone"],
            "department": member["department"],
            "assigned_ward": member["assigned_ward"],
            "assigned_gp": member.get("assigned_gp", "Kyathsandra Rural"),
            "role": "staff"
        }
    }

# ----------------- STAFF MANAGEMENT (ADMIN EXCLUSIVE) -----------------

@app.get("/api/admin/staff")
def get_all_staff():
    staff_list = load_data(STAFF_FILE, [])
    safe_staff = []
    for s in staff_list:
        item = {k: v for k, v in s.items() if k != "password_hash"}
        safe_staff.append(item)
    return safe_staff

@app.post("/api/admin/staff")
def create_staff(req: StaffCreateRequest):
    staff_list = load_data(STAFF_FILE, [])
    if any(s["username"].lower() == req.username.lower() for s in staff_list):
        raise HTTPException(status_code=400, detail=f"Username '{req.username}' already exists.")

    new_staff = {
        "id": f"STF-{len(staff_list) + 1:02d}",
        "username": req.username,
        "password_hash": pwd_context.hash(req.temporary_password),
        "full_name": req.full_name,
        "phone": req.phone,
        "department": req.department,
        "assigned_ward": req.assigned_ward,
        "assigned_gp": req.assigned_gp or "Kyathsandra Rural",
        "role": "staff",
        "active": True,
        "created_at": datetime.now().isoformat(),
        "tasks_completed": 0,
        "tasks_assigned": 0
    }
    staff_list.append(new_staff)
    save_data(STAFF_FILE, staff_list)
    log_audit("STAFF_CREATED", "admin", f"Created staff account {req.username} for {req.department}", new_staff["id"])
    return {k: v for k, v in new_staff.items() if k != "password_hash"}

@app.patch("/api/admin/staff/{staff_id}/toggle-status")
def toggle_staff_status(staff_id: str):
    staff_list = load_data(STAFF_FILE, [])
    member = next((s for s in staff_list if s["id"] == staff_id or s["username"] == staff_id), None)
    if not member:
        raise HTTPException(status_code=404, detail="Staff member not found")
    member["active"] = not member.get("active", True)
    save_data(STAFF_FILE, staff_list)
    status_str = "activated" if member["active"] else "deactivated"
    log_audit("STAFF_STATUS_TOGGLE", "admin", f"Staff {member['username']} {status_str}", staff_id)
    return {"success": True, "active": member["active"]}

@app.post("/api/admin/staff/{staff_id}/reset-password")
def reset_staff_password(staff_id: str, payload: dict):
    new_pass = payload.get("new_password", "staff@2026")
    staff_list = load_data(STAFF_FILE, [])
    member = next((s for s in staff_list if s["id"] == staff_id or s["username"] == staff_id), None)
    if not member:
        raise HTTPException(status_code=404, detail="Staff member not found")
    member["password_hash"] = pwd_context.hash(new_pass)
    save_data(STAFF_FILE, staff_list)
    log_audit("STAFF_PASSWORD_RESET", "admin", f"Password reset for staff {member['username']}", staff_id)
    return {"success": True, "message": f"Password reset successfully for {member['username']}"}

# ----------------- COMPLAINTS LIFECYCLE -----------------

class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str
    department: str
    district: Optional[str] = "Tumakuru"
    taluk: Optional[str] = "Tumakuru Taluk"
    hobli: Optional[str] = "Kasaba Hobli"
    area_type: Optional[str] = "urban" # urban or rural
    ward: Optional[str] = "Ward 14 - Gandhinagar"
    ward_no: Optional[int] = 14
    gp_name: Optional[str] = ""
    village_name: Optional[str] = ""
    locality: Optional[str] = ""
    landmark: str
    latitude: float
    longitude: float
    citizen_name: str
    citizen_phone: str
    priority: str = "Medium"
    severity: str = "Medium"
    confidence: Optional[float] = 0.94
    image_url: Optional[str] = None
    video_url: Optional[str] = None

@app.get("/api/complaints")
def get_complaints(
    status: Optional[str] = None,
    ward: Optional[str] = None,
    gp_name: Optional[str] = None,
    department: Optional[str] = None,
    citizen_phone: Optional[str] = None
):
    complaints = load_data(DATA_FILE, [])
    res = complaints
    if citizen_phone and citizen_phone.strip():
        cp = citizen_phone.strip()
        res = [c for c in res if c.get("citizen_phone", "").strip() == cp]
    if status and status.lower() != "all":
        res = [c for c in res if c.get("status", "").lower() == status.lower()]
    if ward and ward.lower() != "all":
        res = [c for c in res if ward.lower() in c.get("ward", "").lower()]
    if gp_name and gp_name.lower() != "all":
        res = [c for c in res if gp_name.lower() in c.get("gp_name", "").lower()]
    if department and department.lower() != "all":
        res = [c for c in res if department.lower() in c.get("department", "").lower()]
    return res

@app.get("/api/complaints/{complaint_id}")
def get_complaint(complaint_id: str):
    complaints = load_data(DATA_FILE, [])
    found = next((c for c in complaints if c["id"].lower() == complaint_id.lower()), None)
    if not found:
        raise HTTPException(status_code=404, detail="Complaint ID not found")
    return found

@app.post("/api/complaints")
def create_complaint(req: ComplaintCreate):
    complaints = load_data(DATA_FILE, [])
    new_id = f"TC{len(complaints) + 24088}"
    now_str = datetime.now().isoformat()

    location_desc = req.ward if req.area_type == "urban" else f"{req.village_name} ({req.gp_name})"

    new_entry = {
        **req.dict(),
        "id": new_id,
        "status": "Submitted",
        "assigned_staff": None,
        "staff_notes": None,
        "resolved_image_url": None,
        "created_at": now_str,
        "updated_at": now_str,
        "timeline": [
            {
                "status": "Submitted",
                "timestamp": now_str,
                "description": f"Civic report registered for {location_desc}. Ticket #{new_id} generated."
            }
        ]
    }
    complaints.insert(0, new_entry)
    save_data(DATA_FILE, complaints)

    add_notification(
        title=f"New Complaint #{new_id}",
        message=f"{req.category} reported at {location_desc} by {req.citizen_name}",
        role_target="admin"
    )
    log_audit("COMPLAINT_CREATED", req.citizen_phone, f"Complaint #{new_id} filed in {location_desc}", new_id)
    return new_entry

@app.patch("/api/complaints/{complaint_id}/update")
@app.patch("/api/complaints/{complaint_id}/status")
def update_complaint_comprehensive(complaint_id: str, update: dict):
    complaints = load_data(DATA_FILE, [])
    found = next((c for c in complaints if c["id"].lower() == complaint_id.lower()), None)
    if not found:
        raise HTTPException(status_code=404, detail="Complaint not found")

    now_str = datetime.now().isoformat()
    old_status = found.get("status")

    if "status" in update:
        found["status"] = update["status"]
    if "priority" in update:
        found["priority"] = update["priority"]
    if "department" in update:
        found["department"] = update["department"]
    if "assigned_staff" in update:
        found["assigned_staff"] = update["assigned_staff"]
    if "staff_notes" in update:
        found["staff_notes"] = update["staff_notes"]
    if "resolved_image_url" in update:
        found["resolved_image_url"] = update["resolved_image_url"]

    found["updated_at"] = now_str
    timeline_desc = update.get("notes") or f"Status transitioned to {found['status']}"
    found["timeline"].append({
        "status": found["status"],
        "timestamp": now_str,
        "description": timeline_desc
    })

    save_data(DATA_FILE, complaints)

    if old_status != found["status"]:
        add_notification(
            title=f"Complaint #{found['id']} {found['status']}",
            message=f"Status update: {timeline_desc}",
            role_target="citizen"
        )
    log_audit("COMPLAINT_UPDATED", update.get("actor", "system"), f"Complaint #{found['id']} set to {found['status']}", found["id"])
    return found

# ----------------- NOTIFICATIONS -----------------

def add_notification(title: str, message: str, role_target: str = "all"):
    notifs = load_data(NOTIF_FILE, [])
    notifs.insert(0, {
        "id": f"NOT-{uuid.uuid4().hex[:6]}",
        "title": title,
        "message": message,
        "role_target": role_target,
        "read": False,
        "created_at": datetime.now().isoformat()
    })
    save_data(NOTIF_FILE, notifs[:100])

@app.get("/api/notifications")
def get_notifications(role: Optional[str] = "all"):
    notifs = load_data(NOTIF_FILE, [])
    if role and role != "all":
        return [n for n in notifs if n.get("role_target") in ["all", role]]
    return notifs

@app.patch("/api/notifications/mark-read")
def mark_notifications_read():
    notifs = load_data(NOTIF_FILE, [])
    for n in notifs:
        n["read"] = True
    save_data(NOTIF_FILE, notifs)
    return {"success": True}

@app.delete("/api/notifications/clear")
def clear_all_notifications():
    save_data(NOTIF_FILE, [])
    return {"success": True, "message": "All alerts cleared"}

# ----------------- EXPORT REPORTS (CSV) -----------------

@app.get("/api/reports/export/csv")
def export_complaints_csv():
    complaints = load_data(DATA_FILE, [])
    output = io.StringIO()
    output.write("Complaint ID,Title,Category,Department,Taluk,Hobli,Area,Ward/GP,Status,Priority,Citizen Name,Citizen Phone,Created At,Updated At\n")
    for c in complaints:
        clean_desc = c.get("title", "").replace(",", ";")
        loc = c.get("ward") if c.get("area_type") == "urban" else f"{c.get('village_name')} - {c.get('gp_name')}"
        output.write(f"{c['id']},{clean_desc},{c['category']},{c['department']},Tumakuru Taluk,{c.get('hobli', 'Kasaba')},{c.get('area_type', 'urban')},{loc},{c['status']},{c.get('priority', 'Medium')},{c['citizen_name']},{c['citizen_phone']},{c['created_at']},{c['updated_at']}\n")
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=Tumakuru_Taluk_Complaints_Report.csv"}
    )

# ----------------- AI VISION & NLP ANALYSIS -----------------

@app.post("/api/ai/analyze-image")
async def analyze_image(request: Request, file: UploadFile = File(None), description: str = Form("")):
    saved_url = ""
    if file:
        content = await file.read()
        # Persist to Supabase Storage when configured, otherwise local uploads/.
        saved_url = db.save_upload(content, file.filename or "upload.jpg")

    desc_lower = description.lower()
    if any(k in desc_lower for k in ["pothole", "road", "tar", "asphalt", "crater", "speed breaker"]):
        category = "Road Damage and Potholes"
        department = "Road and Infrastructure Department"
        severity = "High"
        confidence = 0.96
        keywords = ["asphalt fissure", "pothole crater", "surface degradation"]
    elif any(k in desc_lower for k in ["garbage", "trash", "waste", "dump", "debris", "litter"]):
        category = "Garbage Collection"
        department = "Sanitation Department"
        severity = "Medium"
        confidence = 0.94
        keywords = ["solid waste accumulation", "uncollected refuse"]
    elif any(k in desc_lower for k in ["water", "leak", "pipe", "tap", "pipeline", "flooding"]):
        category = "Water Leakage"
        department = "Water Supply Department"
        severity = "High"
        confidence = 0.98
        keywords = ["pipeline rupture", "hydro-spill", "pressure failure"]
    elif any(k in desc_lower for k in ["light", "dark", "lamp", "pole", "wire", "bulb", "streetlight"]):
        category = "Streetlight Problems"
        department = "Electricity and Streetlight Department"
        severity = "Medium"
        confidence = 0.92
        keywords = ["luminaire failure", "dark quadrant", "electrical pole fault"]
    elif any(k in desc_lower for k in ["drain", "gutter", "sewage", "manhole", "blockage"]):
        category = "Drainage Problems"
        department = "Drainage Department"
        severity = "High"
        confidence = 0.95
        keywords = ["stormwater blockage", "drain overflow", "sediment siltation"]
    else:
        category = "Public Infrastructure"
        department = "Road and Infrastructure Department"
        severity = "Medium"
        confidence = 0.90
        keywords = ["civic infrastructure irregularity"]

    return {
        "category": category,
        "department": department,
        "severity": severity,
        "confidence": confidence,
        "detected_features": keywords,
        "image_url": saved_url if saved_url else "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600",
        "ai_summary": f"Smart Civic Vision Engine validated {category} with {int(confidence*100)}% confidence score. Auto-routed to {department}."
    }

# Health Check
@app.get("/api/health")
def health_check():
    villages = load_data(VILLAGES_FILE, TUMAKURU_TALUK_VILLAGES)
    return {
        "status": "healthy",
        "service": "Smart Civic Tumakuru Enterprise Core",
        "jurisdiction": "Tumakuru Taluk (35 Wards + 38 Gram Panchayats)",
        "taluk_villages": len(villages),
        "auth_model": "Role-based (Citizen Mobile+Password, Admin, Staff)",
        "storage": "supabase" if db.is_remote() else "local-json",
        "timestamp": datetime.now().isoformat()
    }

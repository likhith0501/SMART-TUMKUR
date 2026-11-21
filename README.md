# Smart Civic – Tumakuru

> **One City. One Platform. Better Living.**
>
> A futuristic, AI-powered 3D Smart Civic Management Platform built exclusively for **Tumakuru City & Taluk**, Karnataka, India.

---

## 🌟 Key Highlights

- **3D Digital Twin City Model**: Interactive Three.js/WebGL digital twin featuring realistic Tumakuru road networks (B.H. Road / NH 206, Ring Road, Kunigal Road, S.S. Puram, SIT College Road), animated traffic simulation (KSRTC buses, autos, cars, two-wheelers), smart LED streetlights, and 3D complaint pins.
- **Tumakuru Taluk & City Location Engine**: Complete coverage across **35 Municipal Wards**, **6 Revenue Hoblis** (Kasaba, Gulur, Bellavi, Hebbur, Kora, Urdigere), **38 Gram Panchayats**, and **55+ Villages** with LGD / verified government records and missing village request workflow.
- **AI-Powered Civic Redressal**: Automated categorization, severity estimation, and department assignment.
- **5-Stage SLA Complaint Lifecycle Tracking**: Real-time progress timeline (Submitted → Verified → Assigned → In Progress → Resolved), before/after photographic proof, and citizen rating system.
- **Role-Based Authentication & Privacy**:
  - **Citizen**: Mobile number + password authentication with dedicated citizen dashboard (citizens only see their own filed complaints).
  - **Administrator**: Comprehensive command center with full civic overview, municipal staff management, audit logging, and CSV exports.
  - **Staff**: Department-scoped task management with status and notes dispatch.
- **Live Census Population Counter**: Real-time demographic growth ticker (City: 384,400+ across 35 Wards • Taluk: ~6.50 Lakhs).
- **Multilingual Support**: English & Kannada (ಕನ್ನಡ).

---

## 🏗️ Project Architecture

```
TMK/
├── backend/
│   ├── main.py                     # FastAPI REST server & auth lifecycle
│   ├── tumakuru_city_data.py       # 35 Wards, infrastructure points, departments
│   ├── tumakuru_taluk_data.py      # 6 Hoblis, 38 GPs, 55+ villages
│   ├── complaints.json             # Civic complaints database
│   ├── citizens.json               # Registered citizen accounts
│   ├── staff.json                  # Municipal field officers
│   ├── audit_logs.json             # Administrative action audit trail
│   └── requirements.txt            # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CityScene.tsx       # 3D Digital Twin & Traffic simulation (Three.js / R3F)
    │   │   ├── CityMap.tsx         # Leaflet GIS interactive map
    │   │   ├── RegisterComplaintModal.tsx # Cascading location & AI form
    │   │   ├── TrackComplaintModal.tsx    # SLA lifecycle tracking modal
    │   │   ├── ComplaintDetailModal.tsx  # Municipal action console
    │   │   ├── LocationManagementView.tsx# Taluk, Hobli, GP, Village manager
    │   │   ├── StaffManagementView.tsx   # Staff accounts and ward assignments
    │   │   └── AuthModal.tsx             # Role-based secure authentication
    │   ├── App.tsx                 # Main application dashboard
    │   └── translations.ts         # English & Kannada localization strings
    └── package.json
```

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
Backend runs at `http://localhost:8000` (API docs at `http://localhost:8000/docs`).

### 2. Frontend Setup (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---




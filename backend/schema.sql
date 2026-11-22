-- PostgreSQL Schema for Smart Civic – Tumakuru
-- Target Database: PostgreSQL 14+ / PostGIS / Neon / Render

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- PostGIS Extension for official geographic boundaries and spatial queries
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Users Table (Multi-role: Citizen, Administrator, Staff)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(64) UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(128) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(128) UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('citizen', 'admin', 'staff')),
    ward VARCHAR(64),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Official Municipal Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    kannada_name VARCHAR(128),
    head VARCHAR(128),
    contact_phone VARCHAR(32),
    email VARCHAR(128),
    avg_resolution_hrs INT DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tumakuru 35 Wards Table
CREATE TABLE IF NOT EXISTS wards (
    ward_no INT PRIMARY KEY,
    ward_name VARCHAR(64) NOT NULL,
    kannada_name VARCHAR(64),
    zone VARCHAR(32),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    population INT,
    boundary_geom GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Civic Infrastructure & Public Assets
CREATE TABLE IF NOT EXISTS city_infrastructure (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    ward_no INT REFERENCES wards(ward_no),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    address TEXT,
    status VARCHAR(32) DEFAULT 'Operational',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Civic Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    department_id VARCHAR(32) REFERENCES departments(id),
    ward_no INT REFERENCES wards(ward_no),
    landmark VARCHAR(128),
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    geom GEOMETRY(Point, 4326),
    citizen_name VARCHAR(128) NOT NULL,
    citizen_phone VARCHAR(15) NOT NULL,
    status VARCHAR(32) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved')),
    priority VARCHAR(16) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Emergency')),
    severity VARCHAR(16) DEFAULT 'Medium',
    confidence NUMERIC(3, 2) DEFAULT 0.94,
    image_url TEXT,
    resolved_image_url TEXT,
    assigned_staff_id UUID REFERENCES users(id),
    staff_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Complaint Status History & Audit Trail
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id VARCHAR(32) REFERENCES complaints(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL,
    description TEXT,
    updated_by VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Notifications Log
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(128) NOT NULL,
    message TEXT NOT NULL,
    role_target VARCHAR(20) DEFAULT 'all',
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Municipal Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(64) NOT NULL,
    performed_by VARCHAR(64) NOT NULL,
    details TEXT,
    target_id VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_ward ON complaints(ward_no);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);

-- ============================================================
-- APPLICATION PERSISTENCE (used by db.py)
-- ============================================================
-- The API persists each JSON collection as one row keyed by the
-- collection name. This gives the FastAPI backend a durable store on
-- Supabase while preserving its existing load/save semantics.
CREATE TABLE IF NOT EXISTS civic_store (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- STORAGE BUCKET for uploaded complaint images / videos
-- ============================================================
-- Public read so <img> tags render; the backend writes using the
-- service-role key which bypasses RLS.
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaints', 'complaints', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of objects in the complaints bucket.
DROP POLICY IF EXISTS "Public read complaints bucket" ON storage.objects;
CREATE POLICY "Public read complaints bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'complaints');

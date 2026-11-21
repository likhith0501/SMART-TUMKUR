export interface Ward {
  ward_no: number;
  ward_name: string;
  kannada_name: string;
  zone: string;
  lat: number;
  lng: number;
  population: number;
  major_localities: string[];
}

export interface Hobli {
  hobli_id: string;
  hobli_name: string;
  kannada_name: string;
  headquarters: string;
  type: string;
}

export interface GramPanchayat {
  gp_code: string;
  gp_name: string;
  kannada_name: string;
  hobli: string;
  wards_count: number;
  population: number;
}

export interface Village {
  lgd_code: string;
  village_name: string;
  kannada_name: string;
  gp_name: string;
  hobli: string;
  pincode: string;
  lat: number;
  lng: number;
}

export interface VillageRequest {
  id: string;
  village_name: string;
  hobli: string;
  gp_name: string;
  taluk: string;
  pincode?: string;
  coordinates?: string;
  submitted_by?: string;
  additional_notes?: string;
  status: 'Pending Verification' | 'Approved' | 'Rejected';
  created_at: string;
  reason?: string;
}

export interface InfrastructurePoint {
  id: string;
  name: string;
  category: string;
  ward_no: number;
  lat: number;
  lng: number;
  address: string;
  status: string;
}

export interface Department {
  id: string;
  name: string;
  kannada_name: string;
  head: string;
  contact_phone: string;
  email: string;
  active_complaints: number;
  avg_resolution_hrs: number;
}

export interface StaffMember {
  id: string;
  username: string;
  full_name: string;
  phone: string;
  department: string;
  assigned_ward: string;
  assigned_gp?: string;
  role: 'staff';
  active: boolean;
  created_at: string;
  tasks_completed: number;
  tasks_assigned: number;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  district?: string;
  taluk?: string;
  hobli?: string;
  area_type?: 'urban' | 'rural';
  ward?: string;
  ward_no?: number;
  gp_name?: string;
  village_name?: string;
  locality?: string;
  landmark: string;
  latitude: number;
  longitude: number;
  citizen_name: string;
  citizen_phone: string;
  status: 'Submitted' | 'Verified' | 'Assigned' | 'In Progress' | 'Resolved';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  priority?: 'Low' | 'Medium' | 'High' | 'Emergency';
  confidence?: number;
  image_url?: string;
  resolved_image_url?: string;
  staff_notes?: string;
  assigned_staff?: string;
  created_at: string;
  updated_at: string;
  timeline?: {
    status: string;
    timestamp: string;
    description: string;
  }[];
}

export interface User {
  id?: string;
  username?: string;
  name: string;
  phone: string;
  email?: string;
  role: 'citizen' | 'admin' | 'staff';
  ward?: string;
  department?: string;
  locality?: string;
}

export type Language = 'en' | 'kn';

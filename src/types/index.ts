export type ReportStatus = 'Pending' | 'Reviewed' | 'Resolved' | 'Rejected';

export type IncidentType = 
  | 'aggressive_driving'
  | 'reckless_driving'
  | 'road_rage'
  | 'unsafe_lane_change'
  | 'speeding'
  | 'tailgating'
  | 'distracted_driving'
  | 'failure_to_signal'
  | 'blocking_traffic'
  | 'employment_defaults'
  | 'safety_violations'
  | 'theft_criminal_activities'
  | 'professional_misconduct'
  | 'other';

export interface Report {
  id: string; // UUID
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
  reporter_profile_id: string; // UUID
  driver_first_name?: string | null;
  driver_last_name?: string | null;
  cdl_number: string;
  driver_email?: string | null;
  driver_phone?: string | null;
  incident_type: IncidentType;
  date_occurred: string; // DATE
  location: string;
  description: string;
  company_name_making_report: string;
  company_phone_making_report?: string | null;
  company_email_making_report?: string | null;
  status: ReportStatus;
  driver_id_license_url?: string | null;
  incident_proofs_urls?: string[] | null;
}

// For ViewReportsPage, we might only select a subset of fields
export interface ReportListItem {
  id: string;
  created_at: string; // Submission timestamp
  driver_name: string; // Combination of first and last
  driver_first_name?: string | null; // For potential individual use
  driver_last_name?: string | null; // For potential individual use
  cdl_number: string;
  driver_email?: string | null;
  driver_phone?: string | null;
  incident_type: IncidentType;
  date_occurred: string; // Date of the incident
  location: string;
  description: string;
  status: ReportStatus;
  company_name_making_report: string;
  driver_id_license_url?: string | null;
  incident_proofs_urls?: string[] | null;
}

// Updated Notification interface to align with the database schema
export interface Notification {
  id: string; // UUID from DB
  title: string; // TEXT NOT NULL from DB
  description: string; // TEXT NOT NULL from DB (maps from 'message' column)
  occurred_at: string; // TIMESTAMPTZ NOT NULL from DB (maps from 'notification_time')
  is_new: boolean; // BOOLEAN DEFAULT TRUE from DB
  link_to?: string | null; // TEXT from DB
  logo?: string | null; // TEXT from DB
  source?: string | null; // TEXT from DB
  // created_at from DB (record creation time) is not explicitly mapped here for UI simplicity,
  // occurred_at (notification_time) is used as the primary event timestamp.
}

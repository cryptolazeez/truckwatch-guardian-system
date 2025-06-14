
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
  incident_type: IncidentType;
  date_occurred: string; // DATE
  location: string;
  description: string;
  company_name_making_report: string;
  company_phone_making_report?: string | null;
  company_email_making_report?: string | null;
  status: ReportStatus;
}

// For ViewReportsPage, we might only select a subset of fields
export interface ReportListItem {
  id: string;
  created_at: string;
  driver_name: string; // Combination of first and last
  incident_type: IncidentType;
  status: ReportStatus;
  company_name_making_report: string;
}

// Definition for Notification items
export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_time: string; // Matches the 'notifications' table 'notification_time' column
  is_new: boolean;
  source?: string | null;
  link_to?: string | null;
  logo?: string | null;
  created_at?: string | null; // Matches the 'notifications' table 'created_at' column
}


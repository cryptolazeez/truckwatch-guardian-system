
import { IncidentType } from '@/types';

export interface DriverProfileReportItem {
  id: string;
  incident_type: IncidentType;
  description: string;
  location: string;
  date_occurred: string;
}

export interface DriverProfileViewData {
  driver_name: string;
  cdl_number: string;
  phone?: string;
  email?: string;
  reports: DriverProfileReportItem[];
  report_count: number;
}


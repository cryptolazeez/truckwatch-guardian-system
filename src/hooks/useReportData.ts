
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ReportListItem, ReportStatus as ReportStatusType, IncidentType } from '@/types';
import { DriverProfileReportItem, DriverProfileViewData } from '@/components/reports/reportTypes';
import { useToast } from '@/hooks/use-toast';

const reportStatuses: ReportStatusType[] = ["Pending", "Reviewed", "Resolved", "Rejected", "info_requested"];

const fetchReports = async (): Promise<ReportListItem[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      id,
      created_at,
      driver_first_name,
      driver_last_name,
      cdl_number,
      incident_type,
      date_occurred,
      location,
      description,
      status,
      company_name_making_report,
      moderator_notes
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching reports:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(report => ({
    id: report.id,
    created_at: report.created_at,
    driver_name: `${report.driver_first_name || ''} ${report.driver_last_name || ''}`.trim() || 'N/A',
    driver_first_name: report.driver_first_name,
    driver_last_name: report.driver_last_name,
    cdl_number: report.cdl_number || 'N/A',
    incident_type: report.incident_type as IncidentType,
    date_occurred: report.date_occurred,
    location: report.location || 'N/A',
    description: report.description || 'No description provided.',
    status: report.status as ReportStatusType,
    company_name_making_report: report.company_name_making_report || 'N/A',
    moderator_notes: report.moderator_notes
  }));
};

export const useReportData = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const { data: allReports = [], isLoading: isLoadingReports, error: reportsError } = useQuery<ReportListItem[], Error>({
    queryKey: ['reports'],
    queryFn: fetchReports,
  });

  const initialStatusFromUrl = searchParams.get('status');
  const validStatuses: (ReportStatusType | "All")[] = [...reportStatuses, "All"];
  const initialStatus = initialStatusFromUrl && validStatuses.includes(initialStatusFromUrl as any) ? initialStatusFromUrl as ReportStatusType | "All" : "All";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ReportStatusType | "All">(initialStatus);
  const [displayedReports, setDisplayedReports] = useState<ReportListItem[]>([]);
  const [driverProfiles, setDriverProfiles] = useState<DriverProfileViewData[]>([]);

  const processAndSetReportData = useCallback((reportsToFilter: ReportListItem[]) => {
    setDisplayedReports(reportsToFilter);

    const groupedByDriver: { [key: string]: ReportListItem[] } = {};
    reportsToFilter.forEach(report => {
      const driverKey = `${report.driver_name}-${report.cdl_number}`;
      if (!groupedByDriver[driverKey]) {
        groupedByDriver[driverKey] = [];
      }
      groupedByDriver[driverKey].push(report);
    });

    const profiles: DriverProfileViewData[] = Object.values(groupedByDriver).map(reports => {
      const representativeReport = reports[0];
      return {
        driver_name: representativeReport.driver_name,
        cdl_number: representativeReport.cdl_number,
        phone: "Not Available", // Placeholder
        email: "Not Available", // Placeholder
        report_count: reports.length,
        reports: reports.map((r): DriverProfileReportItem => ({
          id: r.id,
          incident_type: r.incident_type,
          description: r.description,
          location: r.location,
          date_occurred: r.date_occurred,
        })).sort((a, b) => new Date(b.date_occurred).getTime() - new Date(a.date_occurred).getTime()).slice(0, 5),
      };
    }).sort((a,b) => a.driver_name.localeCompare(b.driver_name));
    setDriverProfiles(profiles);
  }, []);

  const applyFilters = useCallback(() => {
    let reportsToFilter = allReports;
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      reportsToFilter = reportsToFilter.filter(report =>
        report.driver_name.toLowerCase().includes(lowerSearchTerm) ||
        report.company_name_making_report.toLowerCase().includes(lowerSearchTerm) ||
        report.cdl_number.toLowerCase().includes(lowerSearchTerm)
      );
    }
    if (selectedStatus !== "All") {
      reportsToFilter = reportsToFilter.filter(report => report.status === selectedStatus);
    }
    processAndSetReportData(reportsToFilter);
  }, [allReports, searchTerm, selectedStatus, processAndSetReportData]);

  useEffect(() => {
    if (reportsError) {
      toast({
        title: "Error Fetching Reports",
        description: reportsError.message,
        variant: "destructive",
      });
    }
  }, [reportsError, toast]);

  useEffect(() => {
    applyFilters();
  }, [allReports, searchTerm, selectedStatus, applyFilters]);
  
  const handleSearchButtonClick = () => {
    applyFilters(); 
  };

  const handleStatusChange = (value: ReportStatusType | "All") => {
    setSelectedStatus(value);
  };

  return {
    isLoadingReports,
    reportsError,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    handleStatusChange,
    handleSearchButtonClick,
    reportStatuses,
    displayedReports,
    driverProfiles,
  };
};

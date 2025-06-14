import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportListItem, ReportStatus as ReportStatusType, IncidentType } from '@/types';
import { DriverProfileReportItem, DriverProfileViewData } from '@/components/reports/reportTypes'; // Import new types
import ReportSearchFilters from '@/components/reports/ReportSearchFilters';
import ReportStatsHeader from '@/components/reports/ReportStatsHeader';
import AllReportsTable from '@/components/reports/AllReportsTable';
import DriverProfileList from '@/components/reports/DriverProfileList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, XCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/layout/BackButton';

const reportStatuses: ReportStatusType[] = ["Pending", "Reviewed", "Resolved", "Rejected"];

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
      company_name_making_report
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
  }));
};

const ViewReportsPage = () => {
  const { toast } = useToast();
  const { data: allReports = [], isLoading: isLoadingReports, error: reportsError } = useQuery<ReportListItem[], Error>({
    queryKey: ['reports'],
    queryFn: fetchReports,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ReportStatusType | "All">("All");
  const [displayedReports, setDisplayedReports] = useState<ReportListItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("allReports");
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
        reports: reports.map((r): DriverProfileReportItem => ({ // Ensure DriverProfileReportItem type
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


  const uniqueDriversCount = new Set(displayedReports.map(r => `${r.driver_name}-${r.cdl_number}`)).size;

  const handleSearchButtonClick = () => {
    applyFilters(); 
  };
  
  const handleStatusChange = (value: ReportStatusType | "All") => {
    setSelectedStatus(value);
    // applyFilters will be called by useEffect due to selectedStatus change
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <BackButton />
      <ReportSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        handleStatusChange={handleStatusChange}
        handleSearchButtonClick={handleSearchButtonClick}
        reportStatuses={reportStatuses}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-8 p-6 bg-card border rounded-lg">
          <ReportStatsHeader
            displayedReportsCount={displayedReports.length}
            uniqueDriversCount={uniqueDriversCount}
          />
          <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto mb-6">
            <TabsTrigger value="allReports">All Reports</TabsTrigger>
            <TabsTrigger value="driverProfiles">Driver Profiles</TabsTrigger>
          </TabsList>

          {isLoadingReports && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading reports...</p>
            </div>
          )}

          {!isLoadingReports && reportsError && (
            <div className="text-center py-10 text-red-500">
              <XCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Failed to load reports. Please try again later.</p>
            </div>
          )}
          
          {!isLoadingReports && !reportsError && (
            <>
              <TabsContent value="allReports">
                <AllReportsTable reports={displayedReports} />
              </TabsContent>

              <TabsContent value="driverProfiles">
                <DriverProfileList profiles={driverProfiles} />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default ViewReportsPage;


import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportListItem, IncidentType, ReportStatus } from '@/types';
import { DriverProfileViewData, DriverProfileReportItem } from '@/components/reports/reportTypes';
import ReportStatsHeader from '@/components/reports/ReportStatsHeader';
import DriverProfileList from '@/components/reports/DriverProfileList';
import AllReportsTable from '@/components/reports/AllReportsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, XCircle, User } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Function to fetch reports, similar to ViewReportsPage
const fetchReports = async (): Promise<ReportListItem[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      id,
      created_at,
      driver_first_name,
      driver_last_name,
      cdl_number,
      driver_email,
      driver_phone,
      incident_type,
      date_occurred,
      location,
      description,
      status,
      company_name_making_report
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching reports for DriverProfilesPage:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(report => ({
    id: report.id,
    created_at: report.created_at,
    driver_name: `${report.driver_first_name || ''} ${report.driver_last_name || ''}`.trim() || 'N/A',
    driver_first_name: report.driver_first_name,
    driver_last_name: report.driver_last_name,
    cdl_number: report.cdl_number || 'N/A',
    driver_email: report.driver_email,
    driver_phone: report.driver_phone,
    incident_type: report.incident_type as IncidentType,
    date_occurred: report.date_occurred,
    location: report.location || 'N/A',
    description: report.description || 'No description provided.',
    status: report.status as ReportStatus,
    company_name_making_report: report.company_name_making_report || 'N/A',
  }));
};

const DriverProfilesPage = () => {
  const { toast } = useToast();
  const { data: allReports = [], isLoading: isLoadingReports, error: reportsError } = useQuery<ReportListItem[], Error>({
    queryKey: ['allReportsForProfiles'],
    queryFn: fetchReports,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("driverProfiles");
  
  const [driverProfiles, setDriverProfiles] = useState<DriverProfileViewData[]>([]);
  const [filteredReportItems, setFilteredReportItems] = useState<ReportListItem[]>([]);
  const [totalReportCount, setTotalReportCount] = useState<number>(0);

  const processAndFilterData = useCallback(() => {
    let reportsToProcess = allReports;
    const lowerSearchTerm = searchTerm.toLowerCase();

    if (lowerSearchTerm) {
      reportsToProcess = allReports.filter(report =>
        report.driver_name.toLowerCase().includes(lowerSearchTerm) ||
        report.cdl_number.toLowerCase().includes(lowerSearchTerm) ||
        report.company_name_making_report.toLowerCase().includes(lowerSearchTerm)
      );
    }
    setFilteredReportItems(reportsToProcess);

    const groupedByDriver: { [key: string]: ReportListItem[] } = {};
    reportsToProcess.forEach(report => {
      const driverKey = `${report.driver_name}-${report.cdl_number}`; // Normalize key
      if (!groupedByDriver[driverKey]) {
        groupedByDriver[driverKey] = [];
      }
      groupedByDriver[driverKey].push(report);
    });

    const profiles: DriverProfileViewData[] = Object.values(groupedByDriver).map(reports => {
      const representativeReport = reports[0];
      const email = reports.find(r => r.driver_email)?.driver_email || "Not Available";
      const phone = reports.find(r => r.driver_phone)?.driver_phone || "Not Available";
      return {
        driver_name: representativeReport.driver_name,
        cdl_number: representativeReport.cdl_number,
        phone,
        email,
        report_count: reports.length,
        reports: reports.map((r): DriverProfileReportItem => ({
          id: r.id,
          incident_type: r.incident_type,
          description: r.description,
          location: r.location,
          date_occurred: r.date_occurred,
        })).sort((a, b) => new Date(b.date_occurred).getTime() - new Date(a.date_occurred).getTime()).slice(0, 5), // Show 5 most recent
      };
    }).sort((a,b) => a.driver_name.localeCompare(b.driver_name));
    
    setDriverProfiles(profiles);
    setTotalReportCount(reportsToProcess.length);

  }, [allReports, searchTerm]);

  useEffect(() => {
    if (reportsError) {
      toast({
        title: "Error Fetching Data",
        description: reportsError.message,
        variant: "destructive",
      });
    }
  }, [reportsError, toast]);

  useEffect(() => {
    processAndFilterData();
  }, [allReports, searchTerm, processAndFilterData]);

  const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setSearchTerm(tempSearchTerm);
  };

  if (isLoadingReports) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg">Loading driver data...</p>
      </div>
    );
  }

  if (reportsError) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center min-h-[calc(100vh-200px)]">
        <XCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
        <p className="text-lg text-red-600">Failed to load driver data.</p>
        <p className="text-sm text-muted-foreground">{reportsError.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Search className="mr-2 h-5 w-5 text-primary" /> Search Driver Profiles
          </CardTitle>
          <CardDescription>Enter driver's name, CDL, or associated company to find profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="text" 
                placeholder="Driver Name, CDL, or Company..." 
                className="flex-grow" 
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
              />
              <Button type="submit" className="w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {searchTerm && driverProfiles.length === 0 && !isLoadingReports && (
         <Card className="mb-8 text-center py-8">
           <CardContent>
             <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
             <p className="text-xl font-semibold">No Driver Profiles Found</p>
             <p className="text-muted-foreground">
               No profiles match your search criteria "{searchTerm}". Try a different search.
             </p>
           </CardContent>
         </Card>
       )}

      {(driverProfiles.length > 0 || !searchTerm) && !isLoadingReports && (
        <div className="mb-8 p-4 sm:p-6 bg-card border rounded-lg shadow-md">
          <ReportStatsHeader
            displayedReportsCount={totalReportCount}
            uniqueDriversCount={driverProfiles.length}
          />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto mb-6">
              <TabsTrigger value="driverProfiles">Driver Profiles</TabsTrigger>
              <TabsTrigger value="allReports">All Reports ({totalReportCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="driverProfiles">
              <DriverProfileList profiles={driverProfiles} />
            </TabsContent>

            <TabsContent value="allReports">
              <AllReportsTable reports={filteredReportItems} />
            </TabsContent>
          </Tabs>
        </div>
      )}
       {!searchTerm && driverProfiles.length === 0 && !isLoadingReports && (
         <Card className="text-center py-8">
           <CardContent>
             <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
             <p className="text-xl font-semibold">No Driver Data Available</p>
             <p className="text-muted-foreground">
               There is currently no driver data to display. Reports might not have been submitted yet.
             </p>
           </CardContent>
         </Card>
       )}
    </div>
  );
};

export default DriverProfilesPage;

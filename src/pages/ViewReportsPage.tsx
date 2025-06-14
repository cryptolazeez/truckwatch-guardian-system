import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportListItem, ReportStatus as ReportStatusType, IncidentType } from '@/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Search as SearchIcon, Filter, Loader2, User, MapPin, CalendarDays, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

const reportStatuses: ReportStatusType[] = ["Pending", "Reviewed", "Resolved", "Rejected"];

type ActiveTabView = "allReports" | "driverProfiles";

interface DriverProfileReportItem {
  id: string;
  incident_type: IncidentType;
  description: string;
  location: string;
  date_occurred: string;
}

interface DriverProfileViewData {
  driver_name: string;
  cdl_number: string;
  phone?: string;
  email?: string;
  reports: DriverProfileReportItem[];
  report_count: number;
}

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

  const handleFilterAndSetReports = useCallback(() => {
    let reportsToFilter = allReports;
    if (searchTerm) {
      reportsToFilter = reportsToFilter.filter(report =>
        report.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.company_name_making_report.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.cdl_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedStatus !== "All") {
      reportsToFilter = reportsToFilter.filter(report => report.status === selectedStatus);
    }
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
        phone: "Not Available",
        email: "Not Available",
        report_count: reports.length,
        reports: reports.map(r => ({
          id: r.id,
          incident_type: r.incident_type,
          description: r.description,
          location: r.location,
          date_occurred: r.date_occurred,
        })).sort((a, b) => new Date(b.date_occurred).getTime() - new Date(a.date_occurred).getTime()).slice(0, 5),
      };
    }).sort((a,b) => a.driver_name.localeCompare(b.driver_name));
    setDriverProfiles(profiles);

  }, [allReports, searchTerm, selectedStatus]);

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
    handleFilterAndSetReports();
  }, [allReports, handleFilterAndSetReports]);

  const uniqueDriversCount = new Set(displayedReports.map(r => `${r.driver_name}-${r.cdl_number}`)).size;

  const handleSearchButtonClick = () => {
    handleFilterAndSetReports();
  };
  
  const handleStatusChange = (value: ReportStatusType | "All") => {
    setSelectedStatus(value);
    let reportsToFilter = allReports;
    if (searchTerm) {
      reportsToFilter = reportsToFilter.filter(report =>
        report.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.company_name_making_report.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.cdl_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (value !== "All") {
      reportsToFilter = reportsToFilter.filter(report => report.status === value);
    }
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
        phone: "Not Available",
        email: "Not Available",
        report_count: reports.length,
        reports: reports.map(r => ({
          id: r.id,
          incident_type: r.incident_type,
          description: r.description,
          location: r.location,
          date_occurred: r.date_occurred,
        })).sort((a, b) => new Date(b.date_occurred).getTime() - new Date(a.date_occurred).getTime()).slice(0, 5),
      };
    }).sort((a,b) => a.driver_name.localeCompare(b.driver_name));
    setDriverProfiles(profiles);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <SearchIcon className="mr-2 h-5 w-5 text-primary" />
            Search Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <label htmlFor="search-term" className="block text-sm font-medium text-muted-foreground mb-1">
                Search by driver name or company
              </label>
              <Input
                id="search-term"
                type="text"
                placeholder="Search by driver name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="status-filter" className="block text-sm font-medium text-muted-foreground mb-1">
                Filter by status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value: ReportStatusType | "All") => handleStatusChange(value)}
              >
                <SelectTrigger id="status-filter" className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Reports</SelectItem>
                  {reportStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
                <Button onClick={handleSearchButtonClick} className="w-full"> {/* Button takes full width of its grid cell */}
                    <SearchIcon className="mr-2 h-4 w-4" /> Search
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-8 p-6 bg-card border rounded-lg">
            <div className="flex flex-col items-center text-center mb-4">
                <h2 className="text-2xl font-semibold">Published Reports</h2>
                <p className="text-muted-foreground text-sm">
                    {displayedReports.length} {displayedReports.length === 1 ? 'report' : 'reports'} found • {uniqueDriversCount} unique {uniqueDriversCount === 1 ? 'driver' : 'drivers'}
                </p>
                <p className="text-xs text-muted-foreground">
                    All reports have been reviewed and approved by our moderation team.
                </p>
            </div>
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
                <Table>
                  <TableCaption>A list of submitted incident reports. {displayedReports.length === 0 && "No reports match your criteria."}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Driver Name</TableHead>
                      <TableHead>Incident Type</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id.substring(0,8)}...</TableCell>
                        <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{report.driver_name}</TableCell>
                        <TableCell>{report.incident_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</TableCell>
                        <TableCell>{report.company_name_making_report}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              report.status === "Pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                              report.status === "Reviewed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                              report.status === "Resolved" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                              report.status === "Rejected" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : ""
                            }`}
                          >
                            {report.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`#`}> {/* Update Link when report detail page exists */}
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="driverProfiles">
                <div>
                  {driverProfiles.length === 0 && <p className="text-muted-foreground text-center py-4">No driver profiles match your criteria.</p>}
                  {driverProfiles.map(profile => (
                    <Card key={`${profile.driver_name}-${profile.cdl_number}`} className="mb-6">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center">
                          <User className="mr-3 h-6 w-6 text-primary" />
                          <CardTitle>{profile.driver_name}</CardTitle>
                        </div>
                        <Badge variant="secondary">{profile.report_count} {profile.report_count === 1 ? 'Report' : 'Reports'}</Badge>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="text-sm text-muted-foreground mb-4 grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
                          <p><strong>CDL:</strong> {profile.cdl_number}</p>
                          <p><strong>Phone:</strong> {profile.phone || "Not Available"}</p>
                          <p><strong>Email:</strong> {profile.email || "Not Available"}</p>
                        </div>
                        <h4 className="font-semibold mb-2 text-md">Recent Reports:</h4>
                        {profile.reports.length === 0 && <p className="text-sm text-muted-foreground">No recent reports found for this driver matching criteria.</p>}
                        <div className="space-y-4">
                          {profile.reports.map(report => (
                            <div key={report.id} className="p-4 border rounded-md bg-muted/50 dark:bg-muted/20">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="default" className="text-xs">
                                  {report.incident_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </Badge>
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <CalendarDays className="mr-1 h-3 w-3" />
                                  {new Date(report.date_occurred).toLocaleDateString()}
                                </div>
                              </div>
                              <p className="text-sm mb-1.5">{report.description}</p>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {report.location}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default ViewReportsPage;

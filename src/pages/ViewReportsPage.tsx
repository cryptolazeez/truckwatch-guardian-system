import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportListItem, ReportStatus as ReportStatusType, IncidentType, Report as FullReportType } from '@/types';
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
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, FileSearch, Search as SearchIcon, Filter, ListChecks, Hourglass, XCircle, Loader2, User } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { useToast } from '@/hooks/use-toast';
import DriverProfileCard from '@/components/reports/DriverProfileCard';
import { Badge } from '@/components/ui/badge';

const reportStatuses: ReportStatusType[] = ["Pending", "Reviewed", "Resolved", "Rejected"];

// Define a type for grouped reports that includes full details needed by DriverProfileCard
interface GroupedReport {
  driver_name: string;
  cdl_number: string;
  // Reports here need to include description and location for ReportDetailItem
  reports: (ReportListItem & { description: string; location: string })[];
}

const fetchFullReportsForList = async (): Promise<(ReportListItem & { description: string; location: string })[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      id,
      created_at,
      driver_first_name,
      driver_last_name,
      cdl_number,
      incident_type,
      status,
      company_name_making_report,
      description,
      location
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
    cdl_number: report.cdl_number || 'N/A',
    incident_type: report.incident_type as IncidentType, 
    status: report.status as ReportStatusType, 
    company_name_making_report: report.company_name_making_report,
    description: report.description,
    location: report.location,
  }));
};

const ViewReportsPage = () => {
  const { toast } = useToast();
  // Use the new fetch function and type
  const { data: allReports = [], isLoading: isLoadingReports, error: reportsError } = useQuery<(ReportListItem & { description: string; location: string })[], Error>({
    queryKey: ['reportsWithDetails'],
    queryFn: fetchFullReportsForList,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ReportStatusType | "All">("All");
  const [filteredReports, setFilteredReports] = useState<(ReportListItem & { description: string; location: string })[]>([]);
  const [activeTab, setActiveTab] = useState("allReports");

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
    setFilteredReports(reportsToFilter);
  }, [searchTerm, selectedStatus, allReports]);

  const uniqueDriversCount = useMemo(() => {
    const driverNames = new Set(filteredReports.map(report => report.driver_name + report.cdl_number));
    return driverNames.size;
  }, [filteredReports]);

  const groupedDriverReports = useMemo((): GroupedReport[] => {
    if (activeTab !== 'driverProfiles' || filteredReports.length === 0) {
      return [];
    }
    const groups: Record<string, GroupedReport> = {};
    filteredReports.forEach(report => {
      const key = `${report.driver_name}-${report.cdl_number}`;
      if (!groups[key]) {
        groups[key] = {
          driver_name: report.driver_name,
          cdl_number: report.cdl_number,
          reports: [],
        };
      }
      groups[key].reports.push(report);
    });
    return Object.values(groups);
  }, [filteredReports, activeTab]);
  
  const totalReports = allReports.length;
  const pendingReportsCount = allReports.filter(r => r.status === "Pending").length;
  const reviewedReportsCount = allReports.filter(r => r.status === "Reviewed").length;
  // const resolvedReportsCount = allReports.filter(r => r.status === "Resolved").length; // Removed
  // const rejectedReportsCount = allReports.filter(r => r.status === "Rejected").length;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <SearchIcon className="mr-3 h-7 w-7 text-primary" />
            Search Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="search-term" className="block text-sm font-medium text-muted-foreground mb-1">
                Search by driver name, company, or CDL
              </label>
              <Input
                id="search-term"
                type="text"
                placeholder="Driver name, company, CDL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-muted-foreground mb-1">
                Filter by status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value: ReportStatusType | "All") => setSelectedStatus(value)}
              >
                <SelectTrigger id="status-filter" className="w-full">
                  <Filter className="mr-2 h-4 w-4 opacity-50" />
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
          </div>
        </CardContent>
      </Card>

      {/* Published Reports Summary */}
      <div className="text-center my-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-2">Published Reports</h2>
        {!isLoadingReports && (
          <p className="text-muted-foreground text-sm">
            {filteredReports.length} report{filteredReports.length === 1 ? '' : 's'} found
            <span className="mx-2">•</span>
            {uniqueDriversCount} unique driver{uniqueDriversCount === 1 ? '' : 's'}
          </p>
        )}
         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All reports have been reviewed and approved by our moderation team.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto mb-6">
          <TabsTrigger value="allReports">All Reports</TabsTrigger>
          <TabsTrigger value="driverProfiles">Driver Profiles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allReports">
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
            <Table>
              <TableCaption>A list of submitted incident reports. {filteredReports.length === 0 && "No reports match your criteria."}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>CDL</TableHead>
                  <TableHead>Incident Type</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id.substring(0,8)}...</TableCell>
                    <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{report.driver_name}</TableCell>
                    <TableCell>{report.cdl_number}</TableCell>
                    <TableCell>{report.incident_type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</TableCell>
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
                        <Link to={`#`}> 
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="driverProfiles">
          {isLoadingReports && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading driver profiles...</p>
            </div>
          )}
          {!isLoadingReports && reportsError && (
            <div className="text-center py-10 text-red-500">
              <XCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Failed to load driver profiles. Please try again later.</p>
            </div>
          )}
          {!isLoadingReports && !reportsError && groupedDriverReports.length > 0 && (
            <div className="space-y-6">
              {groupedDriverReports.map(group => (
                <DriverProfileCard 
                  key={`${group.driver_name}-${group.cdl_number}`}
                  driverName={group.driver_name}
                  cdlNumber={group.cdl_number}
                  reports={group.reports}
                />
              ))}
            </div>
          )}
          {!isLoadingReports && !reportsError && groupedDriverReports.length === 0 && (
             <div className="text-center py-10 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No driver profiles match your current filters.</p>
                <p className="text-sm">Try adjusting your search or status filter.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewReportsPage;

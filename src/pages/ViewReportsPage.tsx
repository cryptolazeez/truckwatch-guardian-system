
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Report, ReportListItem, ReportStatus as ReportStatusType, IncidentType } from '@/types'; // Assuming types.ts is created
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
import { Eye, FileSearch, Search as SearchIcon, Filter, ListChecks, Hourglass, CheckCircle2, XCircle, UserCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { useToast } from '@/hooks/use-toast';

const reportStatuses: ReportStatusType[] = ["Pending", "Reviewed", "Resolved", "Rejected"];

const fetchReports = async (): Promise<ReportListItem[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      id,
      created_at,
      driver_first_name,
      driver_last_name,
      incident_type,
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
    incident_type: report.incident_type as IncidentType, // Cast as Supabase might return string
    status: report.status as ReportStatusType, // Cast
    company_name_making_report: report.company_name_making_report,
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
  const [filteredReports, setFilteredReports] = useState<ReportListItem[]>([]);

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
        report.company_name_making_report.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedStatus !== "All") {
      reportsToFilter = reportsToFilter.filter(report => report.status === selectedStatus);
    }
    setFilteredReports(reportsToFilter);
  }, [searchTerm, selectedStatus, allReports]);


  // Calculate summary statistics from allReports (not filteredReports)
  const totalReports = allReports.length;
  const pendingReportsCount = allReports.filter(r => r.status === "Pending").length;
  const reviewedReportsCount = allReports.filter(r => r.status === "Reviewed").length;
  const resolvedReportsCount = allReports.filter(r => r.status === "Resolved").length;
  // const rejectedReportsCount = allReports.filter(r => r.status === "Rejected").length; // If needed

  // No explicit handleSearch button needed if useEffect handles filtering live.
  // If button is preferred, move filtering logic into a handleSearch function called by button and useEffect.

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <FileSearch className="mr-3 h-8 w-8 text-primary" />
          View Submitted Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage all incident reports submitted through the platform.
        </p>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardStatCard 
          title="Total Reports" 
          value={totalReports} 
          icon={ListChecks} 
          description={`${totalReports} reports overall`}
        />
        <DashboardStatCard 
          title="Pending Review" 
          value={pendingReportsCount} 
          icon={Hourglass} 
          iconColor="text-yellow-500"
          description={`${pendingReportsCount} reports awaiting action`}
        />
        <DashboardStatCard 
          title="Reviewed Reports" 
          value={reviewedReportsCount} 
          icon={UserCheck} 
          iconColor="text-blue-500"
          description={`${reviewedReportsCount} reports have been reviewed`}
        />
        <DashboardStatCard 
          title="Resolved Reports" 
          value={resolvedReportsCount} 
          icon={CheckCircle2} 
          iconColor="text-green-500"
          description={`${resolvedReportsCount} reports successfully closed`}
        />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <SearchIcon className="mr-2 h-6 w-6" />
            Search & Filter Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
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
            {/* Removed explicit search button as filtering is now live via useEffect */}
          </div>
        </CardContent>
      </Card>

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
          <TableCaption>A list of submitted incident reports. {filteredReports.length === 0 && !isLoadingReports && "No reports match your criteria."}</TableCaption>
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
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id.substring(0,8)}...</TableCell> {/* Shorten ID for display */}
                <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{report.driver_name}</TableCell>
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
                    {/* Placeholder for linking to a detailed report view page, if one exists/is created */}
                    <Link to={`#`}> {/* /view-reports/${report.id} - this route doesn't exist yet */}
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ViewReportsPage;


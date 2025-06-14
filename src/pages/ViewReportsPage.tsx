import React, { useState, useEffect } from 'react';
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
import { Eye, FileSearch, Search as SearchIcon, Filter, ListChecks, Hourglass, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

interface Report {
  id: string;
  dateSubmitted: string;
  driverName: string;
  incidentType: string;
  status: "Pending" | "Reviewed" | "Resolved" | "Rejected";
  companyName: string;
}

const mockReports: Report[] = [
  { id: "RPT001", dateSubmitted: "2025-06-10", driverName: "John Doe", incidentType: "Speeding", status: "Pending", companyName: "Quick Haul Inc." },
  { id: "RPT002", dateSubmitted: "2025-06-11", driverName: "Jane Smith", incidentType: "Reckless Driving", status: "Reviewed", companyName: "Logistics Pros" },
  { id: "RPT003", dateSubmitted: "2025-06-12", driverName: "Mike Johnson", incidentType: "Unsafe Lane Change", status: "Resolved", companyName: "Safe Transports" },
  { id: "RPT004", dateSubmitted: "2025-06-13", driverName: "Sarah Williams", incidentType: "Aggressive Driving", status: "Pending", companyName: "Reliable Freight" },
  { id: "RPT005", dateSubmitted: "2025-06-14", driverName: "David Brown", incidentType: "Employment Defaults", status: "Rejected", companyName: "Quick Haul Inc." },
  { id: "RPT006", dateSubmitted: "2025-06-14", driverName: "Chris Green", incidentType: "Speeding", status: "Pending", companyName: "Logistics Pros" },
  { id: "RPT007", dateSubmitted: "2025-06-15", driverName: "Emily White", incidentType: "Reckless Driving", status: "Resolved", companyName: "Reliable Freight" },
];

const reportStatuses: Report["status"][] = ["Pending", "Reviewed", "Resolved", "Rejected"];

const ViewReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Report["status"] | "All">("All");
  const [filteredReports, setFilteredReports] = useState<Report[]>(mockReports);

  // Calculate summary statistics
  const totalReports = mockReports.length;
  const pendingReportsCount = mockReports.filter(r => r.status === "Pending").length;
  const reviewedReportsCount = mockReports.filter(r => r.status === "Reviewed").length;
  const resolvedReportsCount = mockReports.filter(r => r.status === "Resolved").length;
  const rejectedReportsCount = mockReports.filter(r => r.status === "Rejected").length;

  const handleSearch = () => {
    let reports = mockReports;

    if (searchTerm) {
      reports = reports.filter(report =>
        report.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "All") {
      reports = reports.filter(report => report.status === selectedStatus);
    }
    setFilteredReports(reports);
  };
  
  // Effect to apply search when searchTerm or selectedStatus changes, if you want live filtering
  // For now, we use a search button as per typical dashboard patterns.
  // useEffect(() => {
  //   handleSearch();
  // }, [searchTerm, selectedStatus]);

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
          description={`${mockReports.length} reports overall`}
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
         {/* You can add more cards, for example, for rejected reports */}
         {/* 
         <DashboardStatCard 
           title="Rejected Reports" 
           value={rejectedReportsCount} 
           icon={XCircle} 
           iconColor="text-red-500"
           description={`${rejectedReportsCount} reports were rejected`}
         /> 
         */}
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
                onValueChange={(value: Report["status"] | "All") => setSelectedStatus(value)}
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
            <div className="md:col-start-3">
              <Button onClick={handleSearch} className="w-full md:w-auto">
                <SearchIcon className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableCaption>A list of submitted incident reports. {filteredReports.length === 0 && "No reports match your criteria."}</TableCaption>
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
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>{report.dateSubmitted}</TableCell>
              <TableCell>{report.driverName}</TableCell>
              <TableCell>{report.incidentType}</TableCell>
              <TableCell>{report.companyName}</TableCell>
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
                  <Link to={`/view-reports/${report.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewReportsPage;

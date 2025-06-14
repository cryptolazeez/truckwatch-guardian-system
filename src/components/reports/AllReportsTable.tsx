
import React from 'react';
import { Link } from "react-router-dom";
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
import { Eye } from "lucide-react";
import { ReportListItem, ReportStatus as ReportStatusType, IncidentType } from '@/types';

interface AllReportsTableProps {
  reports: ReportListItem[];
  // onViewReport: (reportId: string) => void; // Placeholder for future navigation
}

// Helper function to format incident type (can be moved to utils if used elsewhere)
const formatIncidentTypeDisplay = (type: IncidentType): string => {
  if (!type) return 'N/A';
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};


const AllReportsTable: React.FC<AllReportsTableProps> = ({ reports }) => {
  return (
    <Table>
      <TableCaption>
        A list of submitted incident reports. {reports.length === 0 && "No reports match your criteria."}
      </TableCaption>
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
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell className="font-medium">{report.id.substring(0,8)}...</TableCell>
            <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{report.driver_name}</TableCell>
            <TableCell>{formatIncidentTypeDisplay(report.incident_type)}</TableCell>
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
                {/* Update Link when report detail page exists, for now links to /reports/:id */}
                <Link to={`/reports/${report.id}`}> 
                  <Eye className="mr-2 h-4 w-4" /> View
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AllReportsTable;


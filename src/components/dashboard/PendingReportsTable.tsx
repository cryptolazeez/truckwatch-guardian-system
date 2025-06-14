
import React from 'react';
import { Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ReportListItem } from '@/types';

interface PendingReportsTableProps {
  reports: ReportListItem[];
}

const PendingReportsTable: React.FC<PendingReportsTableProps> = ({ reports }) => {
  if (reports.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg bg-slate-50">
        <h3 className="text-lg font-semibold text-gray-700">All Caught Up!</h3>
        <p className="text-sm text-gray-500 mt-1">There are no pending reports to review.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Driver Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="font-medium">{report.driver_name}</TableCell>
              <TableCell>{report.company_name_making_report}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/reports/${report.id}`}> 
                    <Eye className="mr-2 h-4 w-4" /> Moderate
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

export default PendingReportsTable;

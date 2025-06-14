
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
import { Eye, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";

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
];

const ViewReportsPage = () => {
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

      <Table>
        <TableCaption>A list of submitted incident reports.</TableCaption>
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
          {mockReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>{report.dateSubmitted}</TableCell>
              <TableCell>{report.driverName}</TableCell>
              <TableCell>{report.incidentType}</TableCell>
              <TableCell>{report.companyName}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    report.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    report.status === "Reviewed" ? "bg-blue-100 text-blue-800" :
                    report.status === "Resolved" ? "bg-green-100 text-green-800" :
                    report.status === "Rejected" ? "bg-red-100 text-red-800" : ""
                  }`}
                >
                  {report.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {/* Placeholder for view details link/button */}
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


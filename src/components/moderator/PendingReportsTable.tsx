
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ReportListItem } from "@/types";
import { Badge } from "@/components/ui/badge";

interface PendingReportsTableProps {
  reports: ReportListItem[];
}

const PendingReportsTable: React.FC<PendingReportsTableProps> = ({ reports }) => {
  if (reports.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No pending reports to review.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report ID</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-mono text-xs">{report.id.substring(0, 8)}</TableCell>
              <TableCell>{report.company_name_making_report}</TableCell>
              <TableCell>{report.location}</TableCell>
              <TableCell>{new Date(report.date_occurred).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant="secondary">{report.incident_type.replace(/_/g, ' ')}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm">
                  <Link to={`/moderator/review/${report.id}`}>Review</Link>
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

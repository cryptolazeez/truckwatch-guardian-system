
import React from 'react';
import { ReportListItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import ReportDetailItem from './ReportDetailItem'; // We'll need full report details here.

interface DriverProfileCardProps {
  driverName: string;
  cdlNumber: string;
  reports: (ReportListItem & { description: string; location: string })[]; // Assuming reports have description and location
}

const DriverProfileCard: React.FC<DriverProfileCardProps> = ({ driverName, cdlNumber, reports }) => {
  return (
    <Card className="mb-6 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <User className="mr-2 h-6 w-6 text-primary" />
            {driverName}
          </CardTitle>
          {reports.length > 0 && (
            <Badge variant="outline">{reports.length} Report{reports.length > 1 ? 's' : ''}</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          <p><strong>CDL:</strong> {cdlNumber || 'N/A'}</p>
          {/* Phone and Email omitted as they are not available per driver */}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {reports.length > 0 ? (
          <>
            <h4 className="text-md font-semibold mt-2 mb-1 text-gray-700 dark:text-gray-300">Recent Reports:</h4>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map(report => (
                <ReportDetailItem key={report.id} report={report} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No reports found for this driver matching the current filters.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverProfileCard;

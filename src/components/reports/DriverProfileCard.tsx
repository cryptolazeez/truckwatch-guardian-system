
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, CalendarDays } from "lucide-react";
import { DriverProfileViewData, DriverProfileReportItem } from './reportTypes';
import { IncidentType } from '@/types';

interface DriverProfileCardProps {
  profile: DriverProfileViewData;
}

// Helper function to format incident type (can be moved to utils if used elsewhere)
const formatIncidentTypeDisplay = (type: IncidentType): string => {
  if (!type) return 'N/A';
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const DriverProfileCard: React.FC<DriverProfileCardProps> = ({ profile }) => {
  return (
    <Card className="mb-6">
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
          {profile.reports.map((report: DriverProfileReportItem) => (
            <div key={report.id} className="p-4 border rounded-md bg-muted/50 dark:bg-muted/20">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="default" className="text-xs">
                  {formatIncidentTypeDisplay(report.incident_type)}
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
  );
};

export default DriverProfileCard;


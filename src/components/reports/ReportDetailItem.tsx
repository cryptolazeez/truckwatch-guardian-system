
import React from 'react';
import { ReportListItem, IncidentType } from '@/types';
import { Badge } from "@/components/ui/badge";
import { MapPin } from 'lucide-react';

interface ReportDetailItemProps {
  report: Pick<ReportListItem, 'incident_type' | 'created_at'> & { description: string; location: string; }; // Assuming full report has description and location
}

const formatIncidentType = (type: IncidentType) => {
  return type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
};

const ReportDetailItem: React.FC<ReportDetailItemProps> = ({ report }) => {
  return (
    <div className="py-4 px-2 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-1">
        <Badge variant="secondary" className="text-xs">
          {formatIncidentType(report.incident_type)}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {new Date(report.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{report.description || "No description available."}</p>
      {report.location && (
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{report.location}</span>
        </div>
      )}
    </div>
  );
};

export default ReportDetailItem;

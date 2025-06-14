
import React from 'react';

interface ReportStatsHeaderProps {
  displayedReportsCount: number;
  uniqueDriversCount: number;
}

const ReportStatsHeader: React.FC<ReportStatsHeaderProps> = ({
  displayedReportsCount,
  uniqueDriversCount,
}) => {
  return (
    <div className="flex flex-col items-center text-center mb-4">
      <h2 className="text-2xl font-semibold">Published Reports</h2>
      <p className="text-muted-foreground text-sm">
        {displayedReportsCount} {displayedReportsCount === 1 ? 'report' : 'reports'} found • {uniqueDriversCount} unique {uniqueDriversCount === 1 ? 'driver' : 'drivers'}
      </p>
      <p className="text-xs text-muted-foreground">
        All reports have been reviewed and approved by our moderation team.
      </p>
    </div>
  );
};

export default ReportStatsHeader;


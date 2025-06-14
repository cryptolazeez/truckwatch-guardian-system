
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportListItem, IncidentType, ReportStatus as ReportStatusType } from '@/types';
import AnalyticsChart from './AnalyticsChart';
// CampaignsList is removed
import NotificationsWidget from './NotificationsWidget';
import MiniCalendarWidget from './MiniCalendarWidget';
import UserProfileWidget from './UserProfileWidget';
import DashboardStatCard from './DashboardStatCard';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ListChecks, Hourglass, UserCheck, CheckCircle2, Eye, Loader2 } from "lucide-react";

const fetchDashboardReports = async (): Promise<ReportListItem[]> => {
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
    console.error("Error fetching reports for dashboard:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(report => ({
    id: report.id,
    created_at: report.created_at,
    driver_name: `${report.driver_first_name || ''} ${report.driver_last_name || ''}`.trim() || 'N/A',
    incident_type: report.incident_type as IncidentType,
    status: report.status as ReportStatusType,
    company_name_making_report: report.company_name_making_report,
  }));
};

const DashboardMainArea = () => {
  const userName = "Alexis"; // Hardcoded
  const currentDate = "Monday, May 06, 2021"; // Hardcoded & Translated

  const { data: reports = [], isLoading: isLoadingReports, error: reportsError } = useQuery<ReportListItem[], Error>({
    queryKey: ['dashboardReports'],
    queryFn: fetchDashboardReports,
  });

  const totalReports = reports.length;
  const pendingReportsCount = reports.filter(r => r.status === "Pending").length;
  const reviewedReportsCount = reports.filter(r => r.status === "Reviewed").length;
  const resolvedReportsCount = reports.filter(r => r.status === "Resolved").length;

  return (
    <div className="flex-1 bg-slate-100 p-6 overflow-y-auto">
      <div className="flex justify-between items-start">
        {/* Main content column */}
        <div className="flex-grow mr-6 space-y-6">
          {/* Greeting */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Good morning, {userName}!</h1>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>

          {/* Report Overview Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Report Overview</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/view-reports">
                  <Eye className="mr-2 h-4 w-4" /> View All Reports
                </Link>
              </Button>
            </div>
            
            {isLoadingReports && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading report stats...</p>
              </div>
            )}

            {!isLoadingReports && reportsError && (
              <div className="text-center py-10 text-red-500">
                <p>Failed to load report statistics.</p>
              </div>
            )}

            {!isLoadingReports && !reportsError && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <DashboardStatCard 
                  title="Total Reports" 
                  value={totalReports} 
                  icon={ListChecks} 
                  description="All submitted reports"
                />
                <DashboardStatCard 
                  title="Pending Review" 
                  value={pendingReportsCount} 
                  icon={Hourglass} 
                  iconColor="text-yellow-500"
                  description="Reports awaiting action"
                />
                <DashboardStatCard 
                  title="Reviewed Reports" 
                  value={reviewedReportsCount} 
                  icon={UserCheck} 
                  iconColor="text-blue-500"
                  description="Reports under review"
                />
                <DashboardStatCard 
                  title="Resolved Reports" 
                  value={resolvedReportsCount} 
                  icon={CheckCircle2} 
                  iconColor="text-green-500"
                  description="Successfully closed reports"
                />
              </div>
            )}
            
            {/* AnalyticsChart is kept, but will need relevant data */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Report Trends (Placeholder)</h3>
            <AnalyticsChart /> 
            <p className="text-xs text-gray-500 mt-2">Note: Chart data needs to be updated to reflect report trends.</p>
          </div>

          {/* CampaignsList component is removed */}
        </div>

        {/* Right gutter/aside */}
        <aside className="w-80 flex-shrink-0 space-y-6">
          <UserProfileWidget />
          <NotificationsWidget />
          <MiniCalendarWidget />
        </aside>
      </div>
    </div>
  );
};

export default DashboardMainArea;


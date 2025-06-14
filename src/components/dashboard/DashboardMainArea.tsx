import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportListItem, IncidentType, ReportStatus as ReportStatusType } from '@/types';
import AnalyticsChart from './AnalyticsChart';
import NotificationsWidget from './NotificationsWidget';
import MiniCalendarWidget from './MiniCalendarWidget';
import UserProfileWidget from './UserProfileWidget';
import DashboardStatCard from './DashboardStatCard';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ListChecks, Hourglass, UserCheck, MapPin, Eye, Loader2 } from "lucide-react";
import { format } from 'date-fns';

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

const processReportsForLastNMonths = (reportsToProcess: ReportListItem[], N: number = 6) => {
  if (!reportsToProcess) return [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData: { name: string, value: number }[] = [];
  const today = new Date();

  for (let i = N - 1; i >= 0; i--) {
    const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = monthNames[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    // Format as "Mon 'YY" e.g., "Jun '25"
    const monthKey = `${monthName} '${String(year).slice(2)}`; 

    const count = reportsToProcess.filter(report => {
      const reportDate = new Date(report.created_at);
      return reportDate.getFullYear() === targetDate.getFullYear() && reportDate.getMonth() === targetDate.getMonth();
    }).length;

    monthlyData.push({ name: monthKey, value: count });
  }
  return monthlyData;
};

const DashboardMainArea = () => {
  const [userName, setUserName] = useState("User");
  const currentDate = format(new Date(), "EEEE, MMMM dd, yyyy");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const emailPart = session.user.email.split('@')[0];
        // Capitalize first letter
        setUserName(emailPart.charAt(0).toUpperCase() + emailPart.slice(1));
      } else if (session?.user) {
        setUserName("Valued User"); // Fallback if email is not available but user exists
      }
    };
    fetchUser();
  }, []);

  const { data: reports = [], isLoading: isLoadingReports, error: reportsError } = useQuery<ReportListItem[], Error>({
    queryKey: ['dashboardReports'],
    queryFn: fetchDashboardReports,
  });

  const totalReports = reports.length;
  const pendingReportsCount = reports.filter(r => r.status === "Pending").length;
  const reviewedReportsCount = reports.filter(r => r.status === "Reviewed").length;

  const chartData = processReportsForLastNMonths(reports, 6);

  return (
    <div className="flex-1 bg-slate-100 dark:bg-slate-900 p-6 overflow-y-auto">
      <div className="flex justify-between items-start">
        {/* Main content column */}
        <div className="flex-grow mr-6 space-y-6">
          {/* Greeting */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Good morning, {userName}!</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">{currentDate}</p>
          </div>

          {/* Report Overview Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-200">Report Overview</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/view-reports">
                  <Eye className="mr-2 h-4 w-4" /> View All Reports
                </Link>
              </Button>
            </div>
            
            {isLoadingReports && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 dark:text-slate-300">Loading report stats...</p>
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
                  title="Driver Tracked" 
                  value={"N/A"} // Placeholder value
                  icon={MapPin} 
                  iconColor="text-purple-500"
                  description="Drivers currently tracked (Feature WIP)"
                />
              </div>
            )}
            
            <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mt-6 mb-2">Report Trends (Last 6 Months)</h3>
            {isLoadingReports ? (
               <div className="flex justify-center items-center h-[250px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 dark:text-slate-300">Loading chart data...</p>
              </div>
            ) : reportsError ? (
              <div className="flex justify-center items-center h-[250px] text-red-500">
                <p>Failed to load chart data.</p>
              </div>
            ) : (
              <AnalyticsChart data={chartData} />
            )}
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Note: Chart displays total reports submitted each month.</p>
          </div>
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

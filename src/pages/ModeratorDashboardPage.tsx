
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Clock, CheckCircle, ShieldAlert } from 'lucide-react';
import { ReportListItem } from '@/types';
import DashboardStatCard from '@/components/moderator/DashboardStatCard';
import PendingReportsTable from '@/components/moderator/PendingReportsTable';

const fetchDashboardData = async () => {
  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select('id, status, created_at, driver_first_name, driver_last_name, location, date_occurred, incident_type, company_name_making_report')
    .order('created_at', { ascending: false });

  if (reportsError) throw reportsError;

  const totalReports = reports.length;
  const pendingReviews = reports.filter(r => r.status === 'Pending').length;
  const publicReports = reports.filter(r => r.status === 'Resolved').length;

  const pendingReportsList: ReportListItem[] = reports
    .filter(r => r.status === 'Pending')
    .map(r => ({
      id: r.id,
      driver_name: `${r.driver_first_name || ''} ${r.driver_last_name || ''}`.trim(),
      location: r.location,
      date_occurred: r.date_occurred,
      incident_type: r.incident_type,
      company_name_making_report: r.company_name_making_report,
      // These fields are not in the slimmed down select, but are part of the type.
      // They are not needed for the pending reports table.
      cdl_number: '',
      created_at: r.created_at,
      description: '',
      status: 'Pending',
    }));

  return { totalReports, pendingReviews, publicReports, pendingReportsList };
};

const ModeratorDashboardPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['moderatorDashboard'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="container mx-auto py-8 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <ShieldAlert className="mr-3 h-8 w-8 text-primary" />
          Moderator Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome! Here's an overview of the reports.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardStatCard title="Total Reports" value={data?.totalReports ?? 0} icon={FileText} />
        <DashboardStatCard title="Driver Reports" value={data?.totalReports ?? 0} icon={FileText} />
        <DashboardStatCard title="Pending Reviews" value={data?.pendingReviews ?? 0} icon={Clock} />
        <DashboardStatCard title="Public Reports" value={data?.publicReports ?? 0} icon={CheckCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports Pending Review</CardTitle>
        </CardHeader>
        <CardContent>
          <PendingReportsTable reports={data?.pendingReportsList ?? []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModeratorDashboardPage;

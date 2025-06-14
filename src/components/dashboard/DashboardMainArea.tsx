
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportListItem, ReportStatus } from '@/types'; // ReportStatus might not be directly used here, but ReportListItem is
import { AlertTriangle, CheckCircle, FileText, Users, Eye, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileWidget from './UserProfileWidget';
import NotificationsWidget from './NotificationsWidget';
// import MiniCalendarWidget from './MiniCalendarWidget'; // Assuming this might be added later or was there before
// import AnalyticsChart from './AnalyticsChart'; // Assuming this might be added later or was there before

const getStatusVariant = (status: ReportStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Pending': return 'default';
    case 'Reviewed': return 'secondary';
    case 'Resolved': return 'outline';
    case 'Rejected': return 'destructive';
    default: return 'default';
  }
};

const DashboardMainArea: React.FC = () => {
  const { data: reports, isLoading: isLoadingReports, error: reportsError } = useQuery<ReportListItem[], Error>({
    queryKey: ['reportsForDashboardMain'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          created_at,
          driver_first_name,
          driver_last_name,
          cdl_number,
          incident_type,
          status,
          company_name_making_report
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching reports:", error);
        throw new Error(error.message);
      }
      return data.map(report => ({
        id: report.id,
        created_at: report.created_at,
        driver_name: `${report.driver_first_name || ''} ${report.driver_last_name || ''}`.trim() || 'N/A',
        cdl_number: report.cdl_number,
        incident_type: report.incident_type,
        status: report.status as ReportStatus,
        company_name_making_report: report.company_name_making_report,
      }));
    },
  });

  const summaryStats = {
    totalReports: reports?.length || 0,
    pendingReports: reports?.filter(r => r.status === 'Pending').length || 0,
    resolvedReports: reports?.filter(r => r.status === 'Resolved').length || 0,
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; description?: string }> = ({ title, value, icon: Icon, description }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );

  return (
    <main className="flex-1 p-6 space-y-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <UserProfileWidget />
        <NotificationsWidget />
        {/* <MiniCalendarWidget /> */}
        {/* <AnalyticsChart /> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Reports Filed" value={summaryStats.totalReports} icon={FileText} description="All reports in the system" />
        <StatCard title="Pending Review" value={summaryStats.pendingReports} icon={AlertTriangle} description="Reports awaiting action" />
        <StatCard title="Resolved Incidents" value={summaryStats.resolvedReports} icon={CheckCircle} description="Reports that have been closed" />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Recent Reports</h2>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link to="/view-reports">
              <Eye className="mr-2 h-4 w-4" /> View All Reports
            </Link>
          </Button>
          <Button asChild>
            <Link to="/drivers">
              <Users className="mr-2 h-4 w-4" /> View Driver Profiles
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-0">
          {isLoadingReports && (
            <div className="p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[200px]" />
                  </div>
                  <Skeleton className="h-6 w-[100px] ml-auto" />
                </div>
              ))}
            </div>
          )}
          {reportsError && <p className="p-4 text-red-500">Error loading reports: {reportsError.message}</p>}
          {!isLoadingReports && !reportsError && reports && reports.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver Name</TableHead>
                  <TableHead className="hidden sm:table-cell">CDL#</TableHead>
                  <TableHead className="hidden md:table-cell">Incident Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Reported By</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.slice(0, 5).map((report) => ( // Displaying only top 5 recent reports here
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.driver_name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{report.cdl_number}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{report.incident_type.split('_').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(report.status)}>{report.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs">{report.company_name_making_report}</TableCell>
                    <TableCell className="text-right text-xs">{new Date(report.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoadingReports && !reportsError && (!reports || reports.length === 0) && (
             <p className="p-4 text-center text-gray-500">No recent reports found.</p>
          )}
        </CardContent>
      </Card>
      {/* Placeholder for other dashboard sections like tasks, messages etc. */}
    </main>
  );
};

export default DashboardMainArea;

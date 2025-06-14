
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportListItem, IncidentType, ReportStatus as ReportStatusType } from '@/types';
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { ListChecks, Hourglass, UserCheck, CheckCircle2, ShieldAlert, Loader2, XCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom'; // For redirecting if not authenticated

// This fetch function is similar to the one in ViewReportsPage
// In a larger app, this could be a shared hook or utility
const fetchAllReportsForStats = async (): Promise<Pick<ReportListItem, 'status'>[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select('status') // Only fetch status for stats calculation
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching reports for stats:", error);
    throw new Error(error.message);
  }
  return (data || []).map(report => ({
    status: report.status as ReportStatusType,
  }));
};

const DashboardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = React.useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view the dashboard.",
          variant: "destructive",
        });
        navigate('/auth?redirect=/dashboard');
      }
      setSessionChecked(true);
    };
    checkSession();
  }, [navigate, toast]);

  const { data: allReportsStats = [], isLoading: isLoadingStats, error: statsError } = useQuery<Pick<ReportListItem, 'status'>[], Error>({
    queryKey: ['reportsStats'],
    queryFn: fetchAllReportsForStats,
    enabled: sessionChecked, // Only run query after session check
  });

  useEffect(() => {
    if (statsError) {
      toast({
        title: "Error Fetching Stats",
        description: statsError.message,
        variant: "destructive",
      });
    }
  }, [statsError, toast]);

  if (!sessionChecked || (isLoadingStats && sessionChecked)) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  if (statsError && sessionChecked) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-semibold mb-2">Failed to Load Dashboard</h2>
        <p className="text-muted-foreground">Could not retrieve the necessary data. Please try again later.</p>
      </div>
    );
  }
  
  // Calculate summary statistics
  const totalReports = allReportsStats.length;
  const pendingReportsCount = allReportsStats.filter(r => r.status === "Pending").length;
  const reviewedReportsCount = allReportsStats.filter(r => r.status === "Reviewed").length;
  const resolvedReportsCount = allReportsStats.filter(r => r.status === "Resolved").length;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <ShieldAlert className="mr-3 h-8 w-8 text-primary" />
          Moderator Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of platform activity and report statuses.
        p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardStatCard 
          title="Total Reports" 
          value={totalReports} 
          icon={ListChecks} 
          description={`${totalReports} reports overall`}
        />
        <DashboardStatCard 
          title="Pending Review" 
          value={pendingReportsCount} 
          icon={Hourglass} 
          iconColor="text-yellow-500"
          description={`${pendingReportsCount} reports awaiting action`}
        />
        <DashboardStatCard 
          title="Reviewed Reports" 
          value={reviewedReportsCount} 
          icon={UserCheck} 
          iconColor="text-blue-500"
          description={`${reviewedReportsCount} reports have been reviewed`}
        />
        <DashboardStatCard 
          title="Resolved Reports" 
          value={resolvedReportsCount} 
          icon={CheckCircle2} 
          iconColor="text-green-500"
          description={`${resolvedReportsCount} reports successfully closed`}
        />
      </div>

      {/* Additional dashboard components or information can be added here */}
      {/* For example, charts, recent activity, quick actions, etc. */}
      <div className="mt-8 p-4 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-xl font-semibold mb-2">Further Development</h2>
        <p className="text-sm text-muted-foreground">
          This dashboard is a starting point. Future enhancements could include more detailed analytics, report management tools, and user administration features for moderators.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;

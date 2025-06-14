
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardMainArea from '@/components/dashboard/DashboardMainArea';

const DashboardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true); // Combined loading state

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view the dashboard.",
          variant: "destructive",
        });
        navigate('/auth?redirect=/dashboard');
        // No need to set isLoading to false here as navigate will change page
      } else {
        setSessionChecked(true);
        // Simulate data loading for the new dashboard components
        // In a real app, fetch necessary data here
        setTimeout(() => setIsLoading(false), 1000); // Placeholder for data loading
      }
    };
    checkSessionAndLoad();
  }, [navigate, toast]);

  if (!sessionChecked || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.14)-1px)]"> {/* Adjust height considering header */}
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // The old stat card logic and useQuery for stats are removed as the UI is completely changing.
  // Data fetching for the new components would be handled within them or passed down.

  return (
    <div className="flex h-[calc(100vh-theme(spacing.14)-1px)] bg-gray-100"> {/* Full height minus header, light gray background */}
      <DashboardSidebar />
      <DashboardMainArea />
    </div>
  );
};

export default DashboardPage;

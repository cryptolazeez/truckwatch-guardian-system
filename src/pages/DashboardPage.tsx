
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
// import DashboardSidebar from '@/components/dashboard/DashboardSidebar'; // Removed sidebar import
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
      } else {
        setSessionChecked(true);
        setTimeout(() => setIsLoading(false), 500); // Shorter placeholder for data loading
      }
    };
    checkSessionAndLoad();
  }, [navigate, toast]);

  if (!sessionChecked || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.14)-1px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.14)-1px)] bg-gray-100"> {/* Removed flex, sidebar took care of flex */}
      {/* <DashboardSidebar /> */} {/* Sidebar component removed */}
      <DashboardMainArea /> {/* Main area will now take full width by default or manage its own width */}
    </div>
  );
};

export default DashboardPage;

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfileData {
  name: string;
  company: string;
  avatarInitials: string;
}

const UserProfileWidget = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAndSetUserProfile = async (currentUser: User | null) => {
      if (currentUser && currentUser.email) {
        // Fetch company name from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', currentUser.id)
          .maybeSingle(); // Use maybeSingle to handle cases where profile might not exist

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
        }

        const emailNamePart = currentUser.email.split('@')[0];
        const name = emailNamePart.charAt(0).toUpperCase() + emailNamePart.slice(1);
        
        let initials = 'U';
        if (name) {
            const nameParts = name.split(' ');
            if (nameParts.length > 1) {
                initials = (nameParts[0][0] + nameParts[nameParts.length -1][0]).toUpperCase();
            } else if (nameParts[0].length > 1) {
                initials = (nameParts[0][0] + nameParts[0][1]).toUpperCase();
            } else {
                initials = nameParts[0][0].toUpperCase();
            }
        }
        
        setUserProfile({
          name: name,
          company: profileData?.company_name || 'N/A',
          avatarInitials: initials,
        });
      } else if (currentUser) { // User exists but no email (e.g. phone auth)
        setUserProfile({
            name: "User",
            company: "N/A",
            avatarInitials: "U",
        });
        console.warn("User does not have an email associated with their account.");
      } else {
        setUserProfile(null); // Clear profile if no user
      }
      setLoading(false);
    };

    // Initial fetch of session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchAndSetUserProfile(session?.user || null);
    }).catch(error => {
      console.error("Error getting session:", error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(true);
      fetchAndSetUserProfile(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/auth'); // Redirect to auth page after logout
    }
  };

  if (loading && !userProfile) { // Show full loader only if no profile yet
    return (
      <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3 animate-pulse">
        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
        <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">?</AvatarFallback>
        </Avatar>
        <div>
            <h3 className="font-semibold text-gray-800">No User</h3>
            <p className="text-sm text-gray-500">Please log in to view profile.</p>
            <Button variant="link" asChild className="p-0 h-auto">
                <Link to="/auth">Login</Link>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">{userProfile.avatarInitials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{userProfile.name}</h3>
        <p className="text-sm text-gray-500">{userProfile.company}</p>
        <div className="flex items-center space-x-2 mt-1">
            <Button variant="link" size="sm" asChild className="text-xs text-primary hover:underline p-0 h-auto">
                <Link to="#"> {/* Replace # with actual account page link later */}
                    <Settings className="mr-1 h-3 w-3" /> Account
                </Link>
            </Button>
            <Button variant="link" size="sm" onClick={handleLogout} disabled={loading} className="text-xs text-destructive hover:underline p-0 h-auto">
                <LogOut className="mr-1 h-3 w-3" /> Log Out
            </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileWidget;

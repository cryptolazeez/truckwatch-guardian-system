import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useAuthActions } from '@/hooks/useAuthActions';
import { Button } from '@/components/ui/button';
import { LogOut, ShieldPlus } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';

interface UserProfileData {
  name: string;
  company: string;
  avatarInitials: string;
}

const UserProfileWidget = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleLogout, isLoading: isAuthLoading } = useAuthActions();
  const { isModerator, user, isLoading: isLoadingRole } = useUserRole();
  const { toast } = useToast();
  const [isAssigningRole, setIsAssigningRole] = useState(false);

  useEffect(() => {
    const fetchAndSetUserProfile = async (currentUser: User | null) => {
      if (currentUser && currentUser.email) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', currentUser.id)
          .maybeSingle();

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
      } else if (currentUser) { 
        setUserProfile({
            name: "User",
            company: "N/A",
            avatarInitials: "U",
        });
        console.warn("User does not have an email associated with their account.");
      } else {
        setUserProfile(null); 
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchAndSetUserProfile(session?.user || null);
    }).catch(error => {
      console.error("Error getting session:", error);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(true);
      fetchAndSetUserProfile(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleBecomeModerator = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to do this.', variant: 'destructive' });
      return;
    }
    setIsAssigningRole(true);
    try {
      const { error } = await supabase.from('user_roles').insert({ user_id: user.id, role: 'moderator' });
      
      if (error) {
        if (error.code === '23505') { // unique_violation
          toast({
            title: "Already a Moderator",
            description: "You already have the moderator role.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Role Assigned!',
          description: "You are now a moderator. The dashboard will refresh.",
        });
        // Reload to reflect role change across the app
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (e: any) {
      console.error("Error assigning role:", e);
      toast({ title: 'Error Assigning Role', description: e.message, variant: 'destructive' });
    } finally {
      setIsAssigningRole(false);
    }
  };

  if (loading || isLoadingRole) {
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
            <p className="text-sm text-gray-500">User information not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">{userProfile.avatarInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{userProfile.name}</h3>
          <p className="text-sm text-gray-500">{userProfile.company}</p>
          <Link to="#" className="text-xs text-primary hover:underline">Account &gt;</Link>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout} 
          disabled={isAuthLoading}
          aria-label="Log out"
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {!isModerator && user && (
          <Button 
              onClick={handleBecomeModerator} 
              disabled={isAssigningRole}
              className="w-full"
          >
              <ShieldPlus className="mr-2 h-4 w-4" />
              {isAssigningRole ? 'Assigning Role...' : 'Become a Moderator (Test)'}
          </Button>
      )}
    </div>
  );
};

export default UserProfileWidget;

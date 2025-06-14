
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoginFormValues } from '@/components/auth/LoginForm';
import { RegisterFormValues } from '@/components/auth/RegisterForm';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data.session) {
      // Fetch user role to redirect correctly
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id)
        .maybeSingle();

      setIsLoading(false);

      if (roleError) {
        toast({
          title: "Login Error",
          description: `Failed to verify user role: ${roleError.message}`,
          variant: "destructive",
        });
        // Log them out to be safe
        await supabase.auth.signOut();
        return;
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      const userRole = roleData?.role;
      if (userRole === 'moderator' || userRole === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
        setIsLoading(false);
        toast({
            title: "Login Failed",
            description: "Could not establish a session. Please try again.",
            variant: "destructive",
        });
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          companyName: values.companyName || null,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setIsLoading(false);
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Successful",
        description: "Please check your email to confirm your account.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) {
      setIsLoading(false);
      toast({
        title: "Google Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    // On success, Supabase handles redirection. setIsLoading(false) might not be hit here
    // or could cause a brief flicker if hit before redirection.
    // If redirection fails or there's no immediate redirect, isLoading should be reset.
    // For now, we only explicitly set isLoading false on error.
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout Successful",
        description: "You have been logged out.",
      });
      navigate('/auth'); // Redirect to login page after logout
    }
  };

  return {
    isLoading,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
    handleLogout, // Export the new logout handler
  };
};


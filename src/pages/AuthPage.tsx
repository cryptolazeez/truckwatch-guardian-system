
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import LoginForm from '@/components/auth/LoginForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useUserRole } from '@/hooks/useUserRole';

const AuthPage = () => {
  const navigate = useNavigate();

  // Use the custom hook for auth actions and isLoading state
  const { isLoading, handleLogin, handleGoogleLogin } = useAuthActions();
  const { isModerator, isLoading: isRoleLoading, user } = useUserRole();

  useEffect(() => {
    // This effect handles redirection for users who are already logged in
    // when they land on the /auth page.
    if (!isRoleLoading && user) {
      if (isModerator) {
        navigate('/moderator-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, isModerator, isRoleLoading, navigate]);

  // Show a loader while checking auth status to prevent content flicker for logged-in users.
  if (isRoleLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 flex items-center justify-center min-h-[calc(100vh-150px)]">
      <Card className="w-full max-w-md shadow-lg bg-lime-100">
        <CardHeader>
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle>Login to TruckWatch</CardTitle>
          <CardDescription>Access your company dashboard or driver profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm isLoading={isLoading} onSubmit={handleLogin} />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-lime-100 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleLoginButton isLoading={isLoading} onClick={handleGoogleLogin} />
          <p className="text-sm text-center text-muted-foreground pt-4">
            Login functionality is now connected to Supabase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;

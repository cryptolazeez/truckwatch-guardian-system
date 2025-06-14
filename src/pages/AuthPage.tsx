
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Loader2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your TruckWatch dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center space-x-2">
              <LogIn className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Sign In</CardTitle>
            </div>
            <CardDescription className="text-center">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm isLoading={isLoading} onSubmit={handleLogin} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>
            
            <GoogleLoginButton isLoading={isLoading} onClick={handleGoogleLogin} />
            
            <div className="text-center pt-4 space-y-2">
              <p className="text-sm text-gray-600">
                Secure login powered by Supabase
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>SSL Secured</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Enterprise Ready</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <button 
              onClick={() => navigate('/moderator-login')}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Moderator Access
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

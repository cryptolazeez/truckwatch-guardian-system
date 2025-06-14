
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useUserRole } from '@/hooks/useUserRole';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  // Use the custom hook for auth actions and isLoading state
  const { isLoading, handleLogin, handleRegister, handleGoogleLogin } = useAuthActions();
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

  useEffect(() => {
    if (location.hash === "#register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [location.hash]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(value === "register" ? "/auth#register" : "/auth", {
      replace: true,
    });
  };

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
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </TabsTrigger>
          <TabsTrigger value="register">
            <UserPlus className="mr-2 h-4 w-4" /> Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="shadow-lg bg-lime-100">
            <CardHeader>
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
        </TabsContent>
        <TabsContent value="register">
          <Card className="shadow-lg bg-sky-100">
            <CardHeader>
              <CardTitle>Register for TruckWatch</CardTitle>
              <CardDescription>Create an account to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm isLoading={isLoading} onSubmit={handleRegister} />
              <p className="text-sm text-center text-muted-foreground pt-4">
                Registration functionality is now connected to Supabase.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AuthPage;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

import LoginForm from '@/components/auth/LoginForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect } from "react";

const ModeratorLoginPage = () => {
  const { isLoading, handleLogin, handleGoogleLogin } = useAuthActions();
  const navigate = useNavigate();
  const { isModerator, user, isLoading: isRoleLoading } = useUserRole();

  useEffect(() => {
    if (!isRoleLoading && user) {
      if (isModerator) {
        navigate('/moderator-dashboard', { replace: true });
      } else {
        navigate('/not-authorized', { replace: true });
      }
    }
  }, [user, isModerator, isRoleLoading, navigate]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 flex items-center justify-center min-h-[calc(100vh-150px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle>Moderator Login</CardTitle>
          <CardDescription>Please enter your credentials to access the moderator dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm isLoading={isLoading} onSubmit={handleLogin} />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleLoginButton isLoading={isLoading} onClick={handleGoogleLogin} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModeratorLoginPage;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthActions } from "@/hooks/useAuthActions";
import { ShieldAlert, Home, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const NotAuthorizedPage = () => {
  const { handleLogout } = useAuthActions();
  
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-150px)] p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="mx-auto bg-red-100 text-red-600 rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-600">
              You don't have moderator permissions to access this area.
            </p>
            <p className="text-sm text-gray-500">
              This page is restricted to authorized moderators only.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout & Try Again
            </Button>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need moderator access? Contact your administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAuthorizedPage;

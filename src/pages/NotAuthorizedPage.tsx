
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthActions } from "@/hooks/useAuthActions";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const NotAuthorizedPage = () => {
  const { handleLogout } = useAuthActions();
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-150px)]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-destructive text-destructive-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You do not have the necessary permissions to view this page. This area is restricted to moderators only.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/">Go to Homepage</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAuthorizedPage;

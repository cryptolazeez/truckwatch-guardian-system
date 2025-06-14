
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    if (location.hash === "#register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [location.hash]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(value === "register" ? "/auth#register" : "/auth", { replace: true });
  };

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
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Login to TruckWatch</CardTitle>
              <CardDescription>Access your company dashboard or driver profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email-login">Email</Label>
                <Input id="email-login" type="email" placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="password-login">Password</Label>
                <Input id="password-login" type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full">Login</Button>
              <p className="text-sm text-center text-muted-foreground">
                This is a placeholder. Full authentication will be implemented with Supabase.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Register for TruckWatch</CardTitle>
              <CardDescription>Create an account to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label htmlFor="companyName-register">Company Name (Optional)</Label>
                <Input id="companyName-register" type="text" placeholder="Your Company LLC" />
              </div>
              <div>
                <Label htmlFor="email-register">Email</Label>
                <Input id="email-register" type="email" placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="password-register">Password</Label>
                <Input id="password-register" type="password" placeholder="••••••••" />
              </div>
               <div>
                <Label htmlFor="confirmPassword-register">Confirm Password</Label>
                <Input id="confirmPassword-register" type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full">Register</Button>
               <p className="text-sm text-center text-muted-foreground">
                This is a placeholder. Full authentication will be implemented with Supabase.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;


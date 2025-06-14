
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User } from "lucide-react";

const DriverProfilesPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Driver Profiles</h1>
        <p className="text-muted-foreground mt-2">Search for driver profiles by CDL number or name.</p>
      </div>

      <Card className="max-w-2xl mx-auto mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" /> Search Drivers
          </CardTitle>
          <CardDescription>Enter CDL number or driver's full name to find their profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input type="text" placeholder="CDL Number or Full Name" className="flex-grow" />
              <Button type="submit" className="w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Placeholder for search results */}
      <div className="text-center text-muted-foreground">
        <p className="mb-4">Search results will appear here. Currently, this is a placeholder.</p>
        {/* Example of a placeholder card - remove or replace with actual data mapping */}
        <Card className="max-w-md mx-auto text-left">
          <CardHeader>
            <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary"/>John Doe</CardTitle>
            <CardDescription>CDL: A12345678 | State: TX</CardDescription>
          </CardHeader>
          <CardContent>
            <p>No incidents reported.</p>
            <Button variant="link" className="p-0 h-auto mt-2">View Full Profile (Coming Soon)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverProfilesPage;


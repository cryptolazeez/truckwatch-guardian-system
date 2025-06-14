
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ShieldAlert, Users, FilePenLine } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon: Icon, title, description, link, linkText }: { icon: React.ElementType, title: string, description: string, link?: string, linkText?: string }) => (
  <Card className="text-center transform transition-all hover:scale-105 hover:shadow-xl">
    <CardHeader>
      <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">{description}</p>
      {link && linkText && (
         <Button asChild variant="link" className="text-primary">
           <Link to={link}>{linkText} <span aria-hidden="true">→</span></Link>
         </Button>
      )}
    </CardContent>
  </Card>
);


const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center ">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-primary">TruckWatch</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
            The comprehensive platform for verifying driver history and reporting incidents in the trucking industry. Ensuring safety and accountability on the road.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <Link to="/report-incident">Report an Incident</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <Link to="/drivers">Search Driver Profiles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">Platform Features</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            TruckWatch provides essential tools for companies and drivers to maintain high standards in the trucking industry.
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={Users}
              title="Driver Profile Management"
              description="Access comprehensive and verified driver histories. (Coming Soon)"
              link="/drivers"
              linkText="Explore Profiles"
            />
            <FeatureCard
              icon={FilePenLine}
              title="Incident Reporting"
              description="Securely report employment defaults, safety violations, and other incidents with supporting evidence."
              link="/report-incident"
              linkText="Report Now"
            />
            <FeatureCard
              icon={ShieldAlert}
              title="Dispute Resolution"
              description="A fair and transparent process for drivers to review and dispute reported incidents. (Coming Soon)"
            />
          </div>
        </div>
      </section>

      {/* Call to Action / Trust Section */}
      <section className="w-full py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Building a Safer Trucking Community
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
            Join us in promoting transparency and safety. Register your company today to access verified driver information and contribute to a more responsible industry.
          </p>
          <Button size="lg" asChild className="mt-8 shadow-lg hover:shadow-xl transition-shadow">
            <Link to="/auth#register">Register Your Company</Link>
          </Button>
        </div>
      </section>

      {/* Footer placeholder */}
      <footer className="w-full py-8 border-t">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TruckWatch. All rights reserved.</p>
          <p className="mt-1">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link> | <Link to="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


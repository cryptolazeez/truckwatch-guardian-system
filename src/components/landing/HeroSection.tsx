import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-blue-700 text-primary-foreground">
      <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Reduce Hiring Risk with <span className="text-yellow-400">Verified</span> Driver History
          </h1>
          <p className="mt-6 max-w-xl text-lg md:text-xl text-blue-100">
            The first centralized platform enabling trucking companies to share and access verified professional conduct records, promoting transparency and accountability industry-wide.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-shadow">
              <Link to="/report-incident">Report a Driver</Link>
            </Button>
            <Button asChild className="btn-17">
              <Link to="/drivers">
                <span className="text-container">
                  <span className="text">View Reports</span>
                </span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="animate-fade-in-up md:animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Card className="bg-white/10 backdrop-blur-sm p-6 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-primary-foreground">Industry Impact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6 text-primary-foreground">
              <div>
                <p className="text-4xl font-bold text-yellow-400">50+</p>
                <p className="text-sm">Target Companies</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-yellow-400">85%</p>
                <p className="text-sm">Risk Reduction</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-yellow-400">24/7</p>
                <p className="text-sm">Platform Access</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-yellow-400">100%</p>
                <p className="text-sm">FCRA Compliant</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TruckLoader from './TruckLoader';

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
        <div className="animate-fade-in-up md:animate-fade-in flex justify-center items-center" style={{ animationDelay: '0.2s' }}>
          <TruckLoader />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

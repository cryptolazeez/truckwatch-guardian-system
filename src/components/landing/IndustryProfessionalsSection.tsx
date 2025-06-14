
import { Building, BarChart3, Briefcase, UserCheck } from "lucide-react";
import DetailCard from './DetailCard';

const IndustryProfessionalsSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-slate-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4 animate-fade-in-up">Built for Industry Professionals</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Designed specifically for the unique needs of trucking industry stakeholders.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <DetailCard icon={Building} title="Trucking Companies" description="Access verified driver histories to make informed hiring decisions and reduce operational risks." items={["Risk assessment tools", "Hiring decision support", "Fleet safety improvement"]}/>
          <DetailCard icon={BarChart3} title="Fleet Managers" description="Streamline driver vetting processes and maintain comprehensive records for fleet operations." items={["Driver performance tracking", "Fleet safety monitoring", "Operational efficiency"]}/>
          <DetailCard icon={Briefcase} title="HR Personnel" description="Enhance recruitment processes with comprehensive background verification and compliance tools." items={["Streamlined hiring", "Compliance management", "Risk mitigation"]}/>
          <DetailCard icon={UserCheck} title="Professional Drivers" description="Access your professional records, dispute inaccuracies, and maintain transparency in your career." items={["Record transparency", "Dispute resolution", "Career protection"]}/>
        </div>
      </div>
    </section>
  );
};

export default IndustryProfessionalsSection;

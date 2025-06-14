
import { Truck, ClipboardList, UsersRound, UserCircle2 } from "lucide-react";
import DetailCard from './DetailCard';

const IndustryProfessionalsSection = () => {
  const cardColors = [
    "bg-sky-50",
    "bg-emerald-50",
    "bg-amber-50",
    "bg-rose-50",
  ];
  const iconColors = [
    "text-sky-600",
    "text-emerald-600",
    "text-amber-600",
    "text-rose-600",
  ];


  return (
    <section className="w-full py-16 md:py-24 bg-slate-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4 animate-fade-in-up">Built for Industry Professionals</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Designed specifically for the unique needs of trucking industry stakeholders.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <DetailCard 
            icon={Truck} 
            title="Trucking Companies" 
            description="Access verified driver histories to make informed hiring decisions and reduce operational risks." 
            items={["Risk assessment tools", "Hiring decision support", "Fleet safety improvement"]}
            cardColor={cardColors[0]}
            iconColor={iconColors[0]}
          />
          <DetailCard 
            icon={ClipboardList} 
            title="Fleet Managers" 
            description="Streamline driver vetting processes and maintain comprehensive records for fleet operations." 
            items={["Driver performance tracking", "Fleet safety monitoring", "Operational efficiency"]}
            cardColor={cardColors[1]}
            iconColor={iconColors[1]}
          />
          <DetailCard 
            icon={UsersRound} 
            title="HR Personnel" 
            description="Enhance recruitment processes with comprehensive background verification and compliance tools." 
            items={["Streamlined hiring", "Compliance management", "Risk mitigation"]}
            cardColor={cardColors[2]}
            iconColor={iconColors[2]}
          />
          <DetailCard 
            icon={UserCircle2} 
            title="Professional Drivers" 
            description="Access your professional records, dispute inaccuracies, and maintain transparency in your career." 
            items={["Record transparency", "Dispute resolution", "Career protection"]}
            cardColor={cardColors[3]}
            iconColor={iconColors[3]}
          />
        </div>
      </div>
    </section>
  );
};

export default IndustryProfessionalsSection;

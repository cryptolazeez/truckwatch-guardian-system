
import { Users, FilePenLine, ShieldCheck, Search, UserCog, Layers } from "lucide-react";
import DetailCard from './DetailCard';

const PlatformFeaturesSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4 animate-fade-in-up">Platform Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Comprehensive toolset designed specifically for the trucking industry's unique hiring challenges.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <DetailCard
            icon={Users}
            title="Driver Profile Management"
            description="Comprehensive driver profiles with CDL information, employment history, and contact details."
            items={["Full name & DOB tracking", "CDL number & state issuance", "Employment history records", "Optional contact information"]}
          />
          <DetailCard
            icon={FilePenLine}
            title="Incident Reporting"
            description="Structured reporting system with evidence upload and categorization for accurate documentation."
            items={["Categorized incident types", "Supporting evidence upload", "Date & description tracking", "Mandatory field validation"]}
          />
          <DetailCard
            icon={ShieldCheck}
            title="Verification Workflow"
            description="Rigorous admin moderation ensures accuracy and fairness in all reported incidents."
            items={["Admin review process", "Driver notification system", "Dispute resolution", "Appeals workflow"]}
          />
           <DetailCard
            icon={Search}
            title="Secure Search & Reports"
            description="Advanced search capabilities with comprehensive reporting for informed decision-making."
            items={["CDL number lookup", "Driver name search", "Verified history reports", "Secure access controls"]}
          />
          <DetailCard
            icon={UserCog}
            title="Role-Based Access"
            description="Sophisticated access management with multi-factor authentication and role-based permissions."
            items={["OAuth authentication", "Multi-factor authentication", "Admin/Company/Driver roles", "Permission controls"]}
          />
          <DetailCard
            icon={Layers}
            title="Compliance Monitoring"
            description="Built-in compliance tools ensuring adherence to FCRA, DOT, and privacy regulations."
            items={["FCRA compliance", "DOT regulations", "GDPR ready", "Audit trail and logging"]}
          />
        </div>
      </div>
    </section>
  );
};

export default PlatformFeaturesSection;

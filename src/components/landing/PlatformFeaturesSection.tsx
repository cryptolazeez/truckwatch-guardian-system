
import { ShieldCheck, Clipboard, FileWarning, FileSearch, UserCog, Gavel } from "lucide-react";
import DetailCard from './DetailCard';

const PlatformFeaturesSection = () => {
  const cardColors = [
    "bg-sky-50",
    "bg-emerald-50",
    "bg-amber-50",
    "bg-rose-50",
    "bg-indigo-50",
    "bg-fuchsia-50",
  ];
  const iconColors = [
    "text-sky-600",
    "text-emerald-600",
    "text-amber-600",
    "text-rose-600",
    "text-indigo-600",
    "text-fuchsia-600",
  ];

  const features = [
    {
      icon: Clipboard, // Corrected: ClipboardUser to Clipboard
      title: "Driver Profile Management",
      description: "Comprehensive driver profiles with CDL information, employment history, and contact details.",
      items: ["Full name & DOB tracking", "CDL number & state issuance", "Employment history records", "Optional contact information"],
    },
    {
      icon: FileWarning,
      title: "Incident Reporting",
      description: "Structured reporting system with evidence upload and categorization for accurate documentation.",
      items: ["Categorized incident types", "Supporting evidence upload", "Date & description tracking", "Mandatory field validation"],
    },
    {
      icon: ShieldCheck,
      title: "Verification Workflow",
      description: "Rigorous admin moderation ensures accuracy and fairness in all reported incidents.",
      items: ["Admin review process", "Driver notification system", "Dispute resolution", "Appeals workflow"],
    },
    {
      icon: FileSearch,
      title: "Secure Search & Reports",
      description: "Advanced search capabilities with comprehensive reporting for informed decision-making.",
      items: ["CDL number lookup", "Driver name search", "Verified history reports", "Secure access controls"],
    },
    {
      icon: UserCog, // Corrected: UsersCog to UserCog
      title: "Role-Based Access",
      description: "Sophisticated access management with multi-factor authentication and role-based permissions.",
      items: ["OAuth authentication", "Multi-factor authentication", "Admin/Company/Driver roles", "Permission controls"],
    },
    {
      icon: Gavel,
      title: "Compliance Monitoring",
      description: "Built-in compliance tools ensuring adherence to FCRA, DOT, and privacy regulations.",
      items: ["FCRA compliance", "DOT regulations", "GDPR ready", "Audit trail and logging"],
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4 animate-fade-in-up">Platform Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Comprehensive toolset designed specifically for the trucking industry's unique hiring challenges.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <DetailCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              items={feature.items}
              cardColor={cardColors[index % cardColors.length]}
              iconColor={iconColors[index % iconColors.length]}
              animationDelay={`${0.2 + index * 0.1}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeaturesSection;

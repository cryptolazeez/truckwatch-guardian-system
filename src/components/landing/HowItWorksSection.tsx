
import HowItWorksStep from './HowItWorksStep';

const HowItWorksSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-slate-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4 animate-fade-in-up">How It Works</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Our 4-step process ensures accurate, verified, and fair reporting of professional conduct incidents.
        </p>
        <div className="space-y-16">
          <HowItWorksStep
            num="1"
            title="Report Incident"
            description="Trucking companies submit detailed incident reports through our secure platform, categorizing by employment defaults, safety violations, theft, or professional misconduct."
            details={["Employment Defaults", "Safety Violations", "Theft/Criminal", "Misconduct"]}
            imgSrc="https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=1000&auto=format&fit=crop"
            imgAlt="User reporting an incident on a modern interface"
          />
          <HowItWorksStep
            num="2"
            title="Verify & Moderate"
            description="Our admin team reviews each submission for accuracy and fairness. Drivers are notified and can dispute through our formal appeals process."
            details={["Admin review & validation", "Driver notification system", "Dispute resolution workflow"]}
            imgSrc="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1000&auto=format&fit=crop"
            imgAlt="Team verifying incident report details"
            reverse={true}
          />
          <HowItWorksStep
            num="3"
            title="Search & Access"
            description="Authorized companies can securely search driver records by CDL number or name, accessing comprehensive verified history reports."
            details={["CDL number lookup", "Driver name search", "Multi-factor authentication"]}
            imgSrc="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1000&auto=format&fit=crop"
            imgAlt="Searching for verified driver records"
          />
          <HowItWorksStep
            num="4"
            title="Make Informed Decisions"
            description="Armed with verified professional conduct data, companies can make confident hiring decisions that reduce risk and improve fleet safety."
            details={["Reduced hiring risks", "Lower operational costs", "Improved fleet safety"]}
            imgSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
            imgAlt="Making informed decisions based on verified data"
            reverse={true}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;


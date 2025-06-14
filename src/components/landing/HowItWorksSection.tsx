
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
            imgSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&auto=format&fit=crop"
            imgAlt="Person reporting an incident using a laptop"
          />
          <HowItWorksStep
            num="2"
            title="Verify & Moderate"
            description="Our admin team reviews each submission for accuracy and fairness. Drivers are notified and can dispute through our formal appeals process."
            details={["Admin review & validation", "Driver notification system", "Dispute resolution workflow"]}
            imgSrc="/lovable-uploads/41c72141-b5fc-47d3-b8b6-e39b941840e0.png"
            imgAlt="Verification process"
            reverse={true}
          />
          <HowItWorksStep
            num="3"
            title="Search & Access"
            description="Authorized companies can securely search driver records by CDL number or name, accessing comprehensive verified history reports."
            details={["CDL number lookup", "Driver name search", "Multi-factor authentication"]}
            imgSrc="/lovable-uploads/f775300b-5be4-48c3-b10c-6b55223b63f0.png"
            imgAlt="Searching for driver records"
          />
          <HowItWorksStep
            num="4"
            title="Make Informed Decisions"
            description="Armed with verified professional conduct data, companies can make confident hiring decisions that reduce risk and improve fleet safety."
            details={["Reduced hiring risks", "Lower operational costs", "Improved fleet safety"]}
            imgSrc="/lovable-uploads/c1c26a61-2b38-4c68-a9c2-cafc52d54484.png"
            imgAlt="Making informed decisions"
            reverse={true}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

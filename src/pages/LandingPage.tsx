
import HeroSection from "@/components/landing/HeroSection";
import WhyDRRSection from "@/components/landing/WhyDRRSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PlatformFeaturesSection from "@/components/landing/PlatformFeaturesSection";
import IndustryProfessionalsSection from "@/components/landing/IndustryProfessionalsSection";
import SecurityComplianceSection from "@/components/landing/SecurityComplianceSection";
import TrustedByLeadersSection from "@/components/landing/TrustedByLeadersSection";
import LandingFooter from "@/components/landing/LandingFooter";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 text-foreground">
      <HeroSection />
      <WhyDRRSection />
      <HowItWorksSection />
      <PlatformFeaturesSection />
      <IndustryProfessionalsSection />
      <SecurityComplianceSection />
      <TrustedByLeadersSection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;

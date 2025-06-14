
import { Card } from "@/components/ui/card";
import { ShieldAlert, Zap, TrendingUp, UserCheck, Briefcase } from "lucide-react";
import ListItem from './ListItem';

const WhyDRRSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4 animate-fade-in-up">Why Driver Reputation Registry?</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Traditional background checks miss critical professional conduct issues. Our platform fills this gap with verified, industry-specific reporting.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="text-left p-6 bg-blue-50 animate-fade-in-up shadow-lg" style={{ animationDelay: '0.2s' }}>
            <ShieldAlert className="h-10 w-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-blue-700">The Problem</h3>
            <p className="text-muted-foreground mb-3">Companies lack visibility into drivers' professional conduct history, leading to expensive hiring mistakes and operational risks.</p>
            <ul className="space-y-1 text-sm text-red-600">
              <li className="flex items-center"><UserCheck className="h-4 w-4 mr-2" /> Employment abandonment</li>
              <li className="flex items-center"><ShieldAlert className="h-4 w-4 mr-2" /> Safety violations</li>
              <li className="flex items-center"><Briefcase className="h-4 w-4 mr-2" /> Professional misconduct</li>
            </ul>
          </Card>
          <Card className="text-left p-6 bg-orange-50 animate-fade-in-up shadow-lg" style={{ animationDelay: '0.3s' }}>
            <Zap className="h-10 w-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-orange-700">Our Solution</h3>
            <p className="text-muted-foreground mb-3">A centralized, verified database of professional conduct records that promotes transparency and accountability.</p>
            <ul className="space-y-1 text-sm text-green-600">
              <ListItem>Verified reporting</ListItem>
              <ListItem>Admin moderation</ListItem>
              <ListItem>Driver dispute process</ListItem>
            </ul>
          </Card>
          <Card className="text-left p-6 bg-green-50 animate-fade-in-up shadow-lg" style={{ animationDelay: '0.4s' }}>
            <TrendingUp className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-green-700">The Results</h3>
            <p className="text-muted-foreground mb-3">Reduced hiring risks, improved fleet safety, and enhanced operational efficiency through informed decision-making.</p>
            <ul className="space-y-1 text-sm text-green-600">
              <ListItem>Lower turnover costs</ListItem>
              <ListItem>Improved safety records</ListItem>
              <ListItem>Better hiring decisions</ListItem>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyDRRSection;

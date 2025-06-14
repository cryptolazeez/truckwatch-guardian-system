
import { ShieldCheck } from "lucide-react";
import ListItem from './ListItem';

const SecurityComplianceSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          <div className="md:w-1/2 animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-Grade Security & Compliance</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Built with the highest security standards and full regulatory compliance to protect sensitive driver data and ensure legal adherence.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {['FCRA Compliant', 'DOT Regulations', 'GDPR Ready', 'SOC 2 Type II'].map(item => (
                <div key={item} className="bg-slate-100 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                  <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-2"/>
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <ListItem>End-to-end data encryption at rest and in transit</ListItem>
              <ListItem>Comprehensive audit trails and activity logging</ListItem>
              <ListItem>Regular security assessments and penetration testing</ListItem>
              <ListItem>Automated backups with disaster recovery</ListItem>
            </ul>
          </div>
          <div className="md:w-1/2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <img 
              src="/lovable-uploads/e5372199-0139-48ad-9438-38ebfa6969df.png" 
              alt="Security Features" 
              className="rounded-lg shadow-xl object-cover w-full h-auto max-h-[450px]" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityComplianceSection;

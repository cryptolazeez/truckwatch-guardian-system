
import { Lock } from "lucide-react";

const TrustedByLeadersSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-slate-50">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4 animate-fade-in-up">Trusted by Industry Leaders</h2>
        <p className="text-muted-foreground mb-12 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Our platform is designed with input from trucking industry experts and compliance professionals.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {[
            { value: '99.9%', label: 'Uptime Guarantee', color: 'text-blue-500' },
            { value: '24/7', label: 'Support Available', color: 'text-orange-500' },
            { value: '<2sec', label: 'Average Response', color: 'text-green-500' },
            { value: 'ISO', label: '27001 Certified', color: 'text-purple-500' },
          ].map((stat, idx) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 animate-fade-in-up" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
              <p className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
        <h3 className="text-xl font-semibold mb-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>Security Certifications & Audits</h3>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          {['SOC 2 Type II', 'ISO 27001', 'FCRA Compliant', 'DOT Approved', 'AWS Partner', 'GDPR Ready'].map(cert =>(
            <div key={cert} className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-5 w-5"/>
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedByLeadersSection;

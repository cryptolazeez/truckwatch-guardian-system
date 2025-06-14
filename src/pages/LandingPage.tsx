import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ShieldAlert, Users, FilePenLine, ArrowRight, TrendingUp, Briefcase, UserCheck, Search, ShieldCheck, Zap, Target, BarChart3, Building, UserCog, Lock, Layers, Award } from "lucide-react"; // Added more icons
import { Link } from "react-router-dom";

// Helper for list items with checkmarks
const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
    <span>{children}</span>
  </li>
);

const HowItWorksStep = ({ num, title, description, details, imgSrc, imgAlt, reverse = false }: { num: string, title: string, description: string, details: string[], imgSrc: string, imgAlt: string, reverse?: boolean }) => (
  <div className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 py-8 animate-fade-in-up ${reverse ? 'md:flex-row-reverse' : ''}`}>
    <div className="md:w-1/2">
      <img src={imgSrc} alt={imgAlt} className="rounded-lg shadow-xl object-cover w-full h-auto max-h-[400px]" />
    </div>
    <div className="md:w-1/2">
      <div className="flex items-center mb-4">
        <span className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold mr-4">{num}</span>
        <h3 className="text-3xl font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-4 text-lg">{description}</p>
      <ul className="space-y-2 text-muted-foreground">
        {details.map((detail, index) => (
          <ListItem key={index}>{detail}</ListItem>
        ))}
      </ul>
    </div>
  </div>
);

const DetailCard = ({ icon: Icon, title, description, items }: { icon: React.ElementType, title: string, description: string, items?: string[] }) => (
  <Card className="text-left transform transition-all hover:scale-105 hover:shadow-xl animate-fade-in-up bg-card flex flex-col">
    <CardHeader>
      <div className="mb-3">
        <Icon className="h-10 w-10 text-primary" />
      </div>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-muted-foreground mb-4">{description}</p>
      {items && (
        <ul className="space-y-1 text-sm text-muted-foreground">
          {items.map((item, idx) => (
            <ListItem key={idx}>{item}</ListItem>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);


const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 text-foreground">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-blue-700 text-primary-foreground">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Reduce Hiring Risk with <span className="text-yellow-400">Verified</span> Driver History
            </h1>
            <p className="mt-6 max-w-xl text-lg md:text-xl text-blue-100">
              The first centralized platform enabling trucking companies to share and access verified professional conduct records, promoting transparency and accountability industry-wide.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                <Link to="/report-incident">Report a Driver</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary shadow-lg hover:shadow-xl transition-shadow">
                <Link to="/drivers">View Reports</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-in-up md:animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="bg-white/10 backdrop-blur-sm p-6 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-foreground">Industry Impact</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6 text-primary-foreground">
                <div>
                  <p className="text-4xl font-bold text-yellow-400">50+</p>
                  <p className="text-sm">Target Companies</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-yellow-400">85%</p>
                  <p className="text-sm">Risk Reduction</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-yellow-400">24/7</p>
                  <p className="text-sm">Platform Access</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-yellow-400">100%</p>
                  <p className="text-sm">FCRA Compliant</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Driver Reputation Registry? Section */}
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

      {/* How It Works Section */}
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
              imgSrc="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop"
              imgAlt="Professional reporting an incident on a laptop"
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

      {/* Platform Features Section */}
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

      {/* Built for Industry Professionals Section */}
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
      
      {/* Enterprise-Grade Security & Compliance Section */}
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
              <img src="/lovable-uploads/2cb1c6b2-779d-4eb3-9843-827204a3f9a8.png" alt="Security and Compliance" className="rounded-lg shadow-xl object-cover w-full h-auto max-h-[450px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Industry Leaders Section */}
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

      {/* Footer placeholder */}
      <footer className="w-full py-8 border-t bg-white">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TruckWatch. All rights reserved.</p>
          <p className="mt-1">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link> | <Link to="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

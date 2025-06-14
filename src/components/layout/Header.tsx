
import { Link } from "react-router-dom";
import { Users, FileText, LogIn, Menu, Home, FileSearch, Truck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface NavItemType {
  href: string;
  label: string;
  icon: React.ElementType;
  alwaysShowIcon?: boolean;
  requiresAuth?: boolean;
}

const navItems: NavItemType[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/report-incident", label: "File Complaint", icon: FileText },
  { href: "/view-reports", label: "View Reports", icon: FileSearch },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const commonNavItems: NavItemType[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/report-incident", label: "File Complaint", icon: FileText },
    { href: "/view-reports", label: "View Reports", icon: FileSearch },
  ];

  const dashboardNavItem: NavItemType = { href: "/dashboard", label: "Dashboard", icon: ShieldAlert, requiresAuth: true };

  const displayedNavItems = session ? [...commonNavItems, dashboardNavItem] : commonNavItems;

  const AuthButtons = () => {
    if (isLoadingSession) {
      return <Button variant="outline" disabled>Loading...</Button>;
    }
    if (session) {
      return (
        <Button variant="outline" asChild>
          <Link to="/dashboard">
            <ShieldAlert className="mr-2 h-4 w-4" /> Moderator Login
          </Link>
        </Button>
      );
    }
    return (
      <Button variant="outline" asChild>
        <Link to="/auth">
          <Users className="mr-2 h-4 w-4" /> Moderator Login
        </Link>
      </Button>
    );
  };

  const NavLink = ({ href, label, icon: Icon, onClick, alwaysShowIcon }: { href: string; label: string; icon: React.ElementType; onClick?: () => void; alwaysShowIcon?: boolean; }) => (
    <Link
      to={href}
      onClick={onClick}
      className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 sm:px-0 sm:py-0"
    >
      <Icon className={`mr-2 h-4 w-4 ${alwaysShowIcon ? '' : 'sm:hidden'}`} />
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Truck className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">TruckWatch</span>
        </Link>
        
        <nav className="hidden sm:flex flex-1 items-center space-x-4 lg:space-x-6">
          {displayedNavItems.map((item) => (
            <NavLink 
              key={item.href} 
              href={item.href} 
              label={item.label} 
              icon={item.icon} 
              alwaysShowIcon={item.alwaysShowIcon} 
            />
          ))}
        </nav>

        <div className="hidden sm:flex flex-1 items-center justify-end space-x-4">
          <AuthButtons />
        </div>

        <div className="sm:hidden flex flex-1 justify-end">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {displayedNavItems.map((item) => (
                  <NavLink 
                    key={item.href} 
                    href={item.href} 
                    label={item.label} 
                    icon={item.icon} 
                    onClick={() => setMobileMenuOpen(false)} 
                    alwaysShowIcon // Always show icon in mobile menu
                  />
                ))}
                <div className="mt-4 pt-4 border-t border-border/40">
                  <AuthButtons />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;


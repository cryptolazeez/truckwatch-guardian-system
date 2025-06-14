
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, LayoutDashboard, MessageSquare, Settings, ChevronDown, Plus, TrendingUp, Briefcase, Zap } from 'lucide-react'; // Added ChevronDown, Plus, TrendingUp, Briefcase, Zap
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  isActive?: boolean;
  badgeCount?: number;
  isSubItem?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href = "#", isActive, badgeCount, isSubItem }) => (
  <a
    href={href}
    className={cn(
      "flex items-center py-2.5 px-4 rounded-md text-sm hover:bg-gray-700 transition-colors w-full",
      isActive ? "bg-primary text-white hover:bg-primary/90" : "text-gray-300",
      isSubItem ? "pl-10" : "pl-4"
    )}
  >
    <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-white" : "text-gray-400")} />
    <span>{label}</span>
    {badgeCount !== undefined && (
      <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
        {badgeCount}
      </span>
    )}
  </a>
);

interface BandItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  notificationCount?: number | string;
}

const BandItem: React.FC<BandItemProps> = ({ icon: Icon, label, href = "#", notificationCount }) => (
   <a
    href={href}
    className="flex items-center py-2 px-4 rounded-md text-sm text-gray-300 hover:bg-gray-700 transition-colors w-full"
  >
    <Icon className="h-4 w-4 mr-2 text-gray-400" />
    <span>{label}</span>
    {notificationCount !== undefined && (
      <span className={cn(
        "ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full",
        typeof notificationCount === 'number' ? "bg-yellow-500 text-gray-900" : "bg-blue-500 text-white"
      )}>
        {notificationCount}
      </span>
    )}
  </a>
);


const DashboardSidebar = () => {
  // Hardcoded user for now
  const user = {
    name: "Alexis Hill",
    company: "Brainin",
    avatarInitials: "AH",
    avatarImage: undefined as string | undefined, // Ensure avatarImage property exists
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full p-4 space-y-6">
      {/* User/Company Info */}
      <div className="flex items-center space-x-3 px-2">
        <Avatar className="h-10 w-10">
          {user.avatarImage && <AvatarImage src={user.avatarImage} alt={user.name} />}
          <AvatarFallback className="bg-primary text-primary-foreground">{user.avatarInitials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-sm">{user.company}</div>
          <div className="text-xs text-gray-400">{user.name}</div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow space-y-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" isActive />
        <NavItem icon={Bell} label="Notifications" badgeCount={3} />
        <NavItem icon={Calendar} label="Calendar" />
        <NavItem icon={MessageSquare} label="Reports" /> {/* Using MessageSquare as per allowed icons */}
        <NavItem icon={Briefcase} label="Publishers" /> {/* Using Briefcase for Publishers */}
      </nav>

      {/* MIEI BANDS Section */}
      <div>
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">MY BANDS</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-0.5">
          <BandItem icon={TrendingUp} label="SoluzioneFAD" notificationCount={2} />
          <BandItem icon={TrendingUp} label="Brianin" notificationCount={7} />
          <BandItem icon={Zap} label="Anticipa" notificationCount="!" />
        </div>
      </div>
      
      {/* Settings */}
      <div className="mt-auto"> {/* Pushes to bottom */}
        <NavItem icon={Settings} label="Settings" />
      </div>
    </div>
  );
};

export default DashboardSidebar;


import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideProps } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType<LucideProps>;
  iconColor?: string;
  description?: string;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ title, value, icon: Icon, iconColor = "text-primary", description }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStatCard;

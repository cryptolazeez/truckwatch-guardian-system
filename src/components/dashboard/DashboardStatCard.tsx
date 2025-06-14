import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"; // CardDescription added if used, else remove
import { LucideProps } from 'lucide-react';
interface DashboardStatCardProps {
  title: string; // This prop will now be correctly used for the card title.
  value: string | number;
  icon: React.ElementType<LucideProps>;
  iconColor?: string;
  description?: string;
}
const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-muted-foreground",
  description
}) => {
  return <Card>
      
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>;
};
export default DashboardStatCard;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideProps } from 'lucide-react';

interface HeroStatCardProps {
  title: string;
  value: string;
  icon: React.ElementType<LucideProps>;
}

const HeroStatCard: React.FC<HeroStatCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground transform transition-all hover:scale-105 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default HeroStatCard;

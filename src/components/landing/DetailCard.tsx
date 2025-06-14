
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ListItem from './ListItem';
import { cn } from '@/lib/utils';

interface DetailCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  items?: string[];
  cardColor?: string;
  iconColor?: string;
}

const DetailCard = ({ icon: Icon, title, description, items, cardColor, iconColor }: DetailCardProps) => (
  <Card className={cn(
    "text-left transform transition-all hover:scale-105 hover:shadow-xl animate-fade-in-up flex flex-col",
    cardColor ? cardColor : "bg-card" // Apply cardColor if provided, else default
  )}>
    <CardHeader>
      <div className="mb-3">
        <Icon className={cn("h-10 w-10", iconColor ? iconColor : "text-primary")} />
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

export default DetailCard;

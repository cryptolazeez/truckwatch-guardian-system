
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Notification } from '@/types'; // Changed import path
import { Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

// Mock data for notifications - replace with actual data fetching
const mockNotifications: Notification[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    title: 'New Report Submitted',
    description: 'Report #1023 for driver John Doe has been submitted.',
    is_read: false,
    link: '/view-reports/1023'
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    title: 'Account Update',
    description: 'Your company profile has been updated successfully.',
    is_read: true,
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    title: 'Maintenance Reminder',
    description: 'Scheduled maintenance tomorrow at 2 AM.',
    is_read: false,
  },
];

const NotificationsWidget = () => {
  const unreadCount = mockNotifications.filter(n => !n.is_read).length;

  return (
    <Card className="bg-background shadow-lg rounded-xl"> {/* Added bg-background */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Notifications</CardTitle>
        <div className="flex items-center">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="mr-2">{unreadCount} New</Badge>
          )}
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {mockNotifications.length === 0 ? (
          <p className="text-sm text-muted-foreground px-6 py-4">No new notifications.</p>
        ) : (
          <ul className="divide-y divide-border">
            {mockNotifications.slice(0, 3).map((notification) => ( // Show max 3 notifications
              <li key={notification.id} className={`p-4 hover:bg-muted/50 ${!notification.is_read ? 'bg-primary/5' : ''}`}>
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
                  {!notification.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary mt-1"></span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{notification.description}</p>
                <p className="text-xs text-muted-foreground/80">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {mockNotifications.length > 0 && (
        <CardFooter className="border-t border-border pt-4">
          <Button variant="outline" size="sm" className="w-full">
            View All Notifications <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationsWidget;

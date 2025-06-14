
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Notification } from '@/types';
import { Bell, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, message, notification_time, is_new, link_to, logo, source')
    .order('notification_time', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    throw new Error(error.message);
  }

  return (data || []).map(n => ({
    id: n.id,
    title: n.title,
    description: n.message,
    occurred_at: n.notification_time,
    is_new: n.is_new,
    link_to: n.link_to,
    logo: n.logo,
    source: n.source,
  }));
};

const NotificationsWidget = () => {
  const queryClient = useQueryClient();
  const { data: initialNotifications, isLoading, error } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications);
    }
  }, [initialNotifications]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('Realtime notification payload:', payload);
          // Refetch notifications to ensure data consistency
          // This is a simpler approach than manually merging updates for now
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const unreadCount = notifications.filter(n => n.is_new).length;

  if (isLoading) {
    return (
      <Card className="bg-background shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Notifications</CardTitle>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Loading notifications...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-background shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Notifications</CardTitle>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-destructive text-center">Failed to load notifications.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Notifications</CardTitle>
        <div className="flex items-center">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="mr-2">{unreadCount} New</Badge>
          )}
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-96 overflow-y-auto"> {/* Added max-h and overflow */}
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground px-6 py-4">No new notifications.</p>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.slice(0, 5).map((notification) => ( // Show max 5 notifications, can be adjusted
              <li key={notification.id} className={`p-4 hover:bg-muted/50 ${notification.is_new ? 'bg-primary/5' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {notification.logo && (
                       <span className="text-xs font-bold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-sm">
                         {notification.logo.substring(0,3)}
                       </span>
                    )}
                    <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
                  </div>
                  {notification.is_new && (
                    <span className="h-2 w-2 rounded-full bg-primary mt-1 flex-shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{notification.description}</p>
                {notification.source && <p className="text-xs text-muted-foreground/80 italic mb-1">Source: {notification.source}</p>}
                <p className="text-xs text-muted-foreground/80">
                  {formatDistanceToNow(new Date(notification.occurred_at), { addSuffix: true })}
                </p>
                {/* Basic link handling, could be improved with react-router Link if internal */}
                {notification.link_to && (
                  <a 
                    href={notification.link_to} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                  >
                    View Details <ArrowRight className="inline-block ml-1 h-3 w-3" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {notifications.length > 0 && (
        <CardFooter className="border-t border-border pt-4">
          <Button variant="outline" size="sm" className="w-full" disabled> {/* Consider where this button leads */}
            View All Notifications <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationsWidget;


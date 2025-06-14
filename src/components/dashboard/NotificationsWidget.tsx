import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types'; // Changed import path
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, CalendarClock, AlertCircle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

const fetchNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('notification_time', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }

  return data || [];
};

const NotificationsWidget = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const initialNotifications = await fetchNotifications();
        setNotifications(initialNotifications);
      } catch (err: any) {
        setError(err.message || 'Failed to load notifications.');
        console.error("Failed to fetch notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();

    const notificationsSubscription = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('Change received!', payload)
          loadNotifications();
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(notificationsSubscription)
    }
  }, []);

  const getIcon = (logo?: string) => {
    switch (logo) {
      case 'calendar':
        return <CalendarClock className="h-5 w-5" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'check':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-blue-50 dark:bg-blue-900/30 overflow-hidden shadow-lg animate-fade-in">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center text-lg">
          <BellRing className="mr-2 h-5 w-5 text-primary" />
          Recent Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-80 overflow-y-auto">
        {isLoading && (
          <div className="p-4 space-y-2">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-4 w-3/4"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-3 w-5/6"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-3 w-1/2"></div>
          </div>
        )}
        {!isLoading && error && (
          <div className="p-4 text-red-500">
            Error: {error}
          </div>
        )}
        {!isLoading && !error && notifications.length === 0 && (
          <div className="p-4 text-gray-500 dark:text-gray-400">
            No new notifications.
          </div>
        )}
        {!isLoading && !error && notifications.length > 0 && (
          <ul className="divide-y">
            {notifications.map((notification) => (
              <li key={notification.id} className={`p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${notification.is_new ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                <a href={notification.link_to || '#'} className="flex items-start space-x-3 group">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${notification.logo && notification.logo.length <= 3 ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : ''}`}>
                    {notification.logo && notification.logo.length <= 3 ? notification.logo : getIcon(notification.logo)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNowStrict(new Date(notification.notification_time), { addSuffix: true })}
                      {notification.source && ` • ${notification.source}`}
                    </p>
                  </div>
                  {notification.is_new && (
                    <span className="h-2 w-2 rounded-full bg-primary mt-1 animate-pulse"></span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {notifications.length > 0 && !isLoading && !error && (
        <CardFooter className="border-t p-3">
          <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary">
            View all notifications
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationsWidget;

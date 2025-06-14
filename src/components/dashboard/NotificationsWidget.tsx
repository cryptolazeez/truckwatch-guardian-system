import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNowStrict } from 'date-fns';
import { Tables } from '@/integrations/supabase/types'; // Import the auto-generated types
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

interface NotificationItemProps {
  id: string;
  logo: string | null;
  title: string;
  message: string;
  source: string | null;
  time: string; // This will be the formatted time string
  isNew?: boolean | null;
  linkTo?: string | null;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ id, logo, title, message, source, time, isNew, linkTo }) => (
  <div className="flex items-start space-x-3 py-3 border-b border-gray-200 last:border-b-0">
    <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
      {logo || title.substring(0, 2).toUpperCase()}
    </div>
    <div className="flex-grow">
      <Link to={linkTo || "#"} className="hover:no-underline">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-sm text-gray-800 hover:text-primary transition-colors">{title}</h4>
          {isNew && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></span>}
        </div>
        <p className="text-sm text-gray-600">{message}</p>
        {source && <p className="text-xs text-gray-400">{source}</p>}
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </Link>
    </div>
  </div>
);

const NotificationsWidget = () => {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('notification_time', { ascending: false })
        .limit(5); // Limit to 5 notifications for the widget

      if (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch notifications.',
          variant: 'destructive',
        });
        setNotifications([]);
      } else if (data) {
        const formattedNotifications = data.map((n: Tables<'notifications'>) => ({
          id: n.id,
          logo: n.logo,
          title: n.title,
          message: n.message,
          source: n.source,
          time: formatDistanceToNowStrict(new Date(n.notification_time), { addSuffix: true }),
          isNew: n.is_new,
          linkTo: n.link_to,
        }));
        setNotifications(formattedNotifications);
      }
      setLoading(false);
    };

    fetchNotifications();

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('New notification received:', payload);
          const newNotification = payload.new as Tables<'notifications'>;
          // Add to the beginning of the list and keep it to 5 items
          setNotifications((prevNotifications) => [
            {
              id: newNotification.id,
              logo: newNotification.logo,
              title: newNotification.title,
              message: newNotification.message,
              source: newNotification.source,
              time: formatDistanceToNowStrict(new Date(newNotification.notification_time), { addSuffix: true }),
              isNew: newNotification.is_new,
              linkTo: newNotification.link_to,
            },
            ...prevNotifications,
          ].slice(0, 5));
          toast({
            title: "New Notification",
            description: newNotification.title,
          });
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to notifications channel!');
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('Error subscribing to notifications:', err);
          toast({
            title: 'Real-time Error',
            description: 'Could not connect to real-time notification updates. Please refresh.',
            variant: 'destructive',
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Notifications</h3>
      {loading ? (
        <div className="space-y-3 flex-grow">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 py-3">
              <Skeleton className="w-10 h-10 rounded" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-500 flex-grow flex items-center justify-center">No new notifications.</p>
      ) : (
        <div className="space-y-1 flex-grow overflow-y-auto pr-1"> {/* Added pr-1 for scrollbar space if needed */}
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} {...notification} />
          ))}
        </div>
      )}
      <div className="mt-4 text-center border-t border-gray-200 pt-3">
        <Link to="#" className="text-sm text-primary hover:underline">
          View all notifications &gt;
        </Link>
      </div>
    </div>
  );
};

export default NotificationsWidget;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NotificationItemProps {
  logo: string; // URL or placeholder for logo
  title: string;
  message: string;
  source: string;
  time: string;
  isNew?: boolean;
}

const notifications: NotificationItemProps[] = [
  { logo: 'ON', title: 'Nuovo commento', message: 'Potresti spiegare meglio?', source: 'QuotidianoNazionale - SoluzioneFAD', time: '1 giorno fa', isNew: true },
  { logo: 'WI', title: 'Wired IT', message: 'Nuovo publisher - Senior', source: 'Cinque soluzione per una magiore - SoluzioneFAD', time: '2 giorni fa', isNew: true },
];

const NotificationItem: React.FC<NotificationItemProps> = ({ logo, title, message, source, time, isNew }) => (
  <div className="flex items-start space-x-3 py-3 border-b border-gray-200 last:border-b-0">
    <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
      {logo} {/* Simple text logo for now */}
    </div>
    <div className="flex-grow">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
        {isNew && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
      </div>
      <p className="text-sm text-gray-600">{message}</p>
      <p className="text-xs text-gray-400">{source}</p>
      <p className="text-xs text-gray-400 mt-0.5">{time}</p>
    </div>
  </div>
);


const NotificationsWidget = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Notifiche</h3>
      <div className="space-y-1">
        {notifications.map((notification, index) => (
          <NotificationItem key={index} {...notification} />
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link to="#" className="text-sm text-primary hover:underline">
          Vedi tutte le notifiche &gt;
        </Link>
      </div>
    </div>
  );
};

export default NotificationsWidget;

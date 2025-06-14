
import React from 'react';
import { Button } from '@/components/ui/button';
import { Megaphone, Lightbulb, MessageCircle, ChevronRight } from 'lucide-react'; // Example icons

interface Campaign {
  id: string;
  title: string;
  status: 'Attivo' | 'In attesa';
  lastActivity: string;
  icon: React.ElementType;
  comments?: number;
  views?: number; // Using views as an example for the right-side number
  progress?: number; // For the small progress bar like in the image
}

const campaignsData: Campaign[] = [
  { id: '1', title: 'Soluzionefad app personalizata', status: 'Attivo', lastActivity: 'Lanciato: 02 Ott. 2021', icon: Megaphone, views: 28, progress: 60 },
  { id: '2', title: 'eLearning più di moda, adesso anche dal cellulare', status: 'In attesa', lastActivity: 'Ultima attività: 02 Ott. 2021', icon: Lightbulb, views: 19, progress: 30 },
  { id: '3', title: '3 tips per una migliore gestione aziendale', status: 'In attesa', lastActivity: 'Ultima attività: 02 Ott. 2021', icon: MessageCircle, views: 31, progress: 10 },
];

const CampaignItem: React.FC<Campaign> = ({ title, status, lastActivity, icon: Icon, views, progress }) => (
  <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
    <div className="mr-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'Attivo' ? 'bg-green-100' : 'bg-yellow-100'}`}>
        <Icon className={`h-5 w-5 ${status === 'Attivo' ? 'text-green-600' : 'text-yellow-600'}`} />
      </div>
    </div>
    <div className="flex-grow">
      <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      <p className="text-xs text-gray-500">
        <span className={`font-medium ${status === 'Attivo' ? 'text-green-600' : 'text-yellow-600'}`}>{status}</span> - {lastActivity}
      </p>
      {progress !== undefined && (
        <div className="w-1/3 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
    <div className="flex items-center text-gray-500 text-sm ml-4">
      {views !== undefined && <MessageCircle className="h-4 w-4 mr-1" />}
      {views !== undefined && <span>{views}</span>}
      <ChevronRight className="h-5 w-5 ml-2 text-gray-400" />
    </div>
  </div>
);

const CampaignsList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Campagne</h2>
        {/* Could add filters or "View All" button here */}
      </div>
      <div className="flex space-x-6 mb-4 border-b pb-4">
        <div><span className="text-3xl font-bold text-gray-800">22</span> <span className="text-sm text-gray-500">Totale</span></div>
        <div><span className="text-3xl font-bold text-green-600">1</span> <span className="text-sm text-gray-500">Attive</span></div>
        <div><span className="text-3xl font-bold text-yellow-600">2</span> <span className="text-sm text-gray-500">In attesa</span></div>
        <div><span className="text-3xl font-bold text-gray-400">19</span> <span className="text-sm text-gray-500">Bozze</span></div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-600 mb-2">✓ SoluzioneFAD</h3>
        {campaignsData.map(campaign => <CampaignItem key={campaign.id} {...campaign} />)}
        <p className="text-xs text-gray-400 mt-2 px-4">11 bozze</p>
      </div>
      {/* Add other campaign groups like Brainin if needed */}
    </div>
  );
};

export default CampaignsList;

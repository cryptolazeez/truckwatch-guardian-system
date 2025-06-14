
import React from 'react';
import AnalyticsChart from './AnalyticsChart';
import CampaignsList from './CampaignsList';
import NotificationsWidget from './NotificationsWidget';
import MiniCalendarWidget from './MiniCalendarWidget';
import UserProfileWidget from './UserProfileWidget';

const DashboardMainArea = () => {
  const userName = "Alexis"; // Hardcoded
  const currentDate = "Monday, May 06, 2021"; // Hardcoded & Translated

  return (
    <div className="flex-1 bg-slate-100 p-6 overflow-y-auto">
      <div className="flex justify-between items-start">
        {/* Main content column */}
        <div className="flex-grow mr-6 space-y-6">
          {/* Greeting */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Good morning, {userName}!</h1>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>

          {/* Performance Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-1">Performance</h2>
            <div className="flex space-x-8 mb-4 text-sm text-gray-600">
              <div><strong className="text-2xl text-gray-800">14.6K</strong> Visits</div>
              <div><strong className="text-2xl text-gray-800">18.9K</strong> Clicks</div>
              <div><strong className="text-2xl text-gray-800">1.1K</strong> Bounce Rate</div>
            </div>
            <AnalyticsChart />
          </div>

          {/* Campaigns Section */}
          <CampaignsList />
        </div>

        {/* Right gutter/aside */}
        <aside className="w-80 flex-shrink-0 space-y-6">
          <UserProfileWidget />
          <NotificationsWidget />
          <MiniCalendarWidget />
        </aside>
      </div>
    </div>
  );
};

export default DashboardMainArea;

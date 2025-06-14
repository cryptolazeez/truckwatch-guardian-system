
import React from 'react';
import DriverProfileCard from './DriverProfileCard';
import { DriverProfileViewData } from './reportTypes';

interface DriverProfileListProps {
  profiles: DriverProfileViewData[];
}

const DriverProfileList: React.FC<DriverProfileListProps> = ({ profiles }) => {
  if (profiles.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No driver profiles match your criteria.</p>;
  }

  return (
    <div>
      {profiles.map(profile => (
        <DriverProfileCard key={`${profile.driver_name}-${profile.cdl_number}`} profile={profile} />
      ))}
    </div>
  );
};

export default DriverProfileList;


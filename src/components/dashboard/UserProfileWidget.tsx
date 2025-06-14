
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

const UserProfileWidget = () => {
  const user = {
    name: "Alexis Hill",
    company: "Brainin",
    avatarInitials: "AH",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
      <Avatar className="h-12 w-12">
        {/* <AvatarImage src="/path-to-avatar.png" alt={user.name} /> */}
        <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">{user.avatarInitials}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold text-gray-800">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.company}</p>
        <Link to="#" className="text-xs text-primary hover:underline">Account &gt;</Link>
      </div>
    </div>
  );
};

export default UserProfileWidget;

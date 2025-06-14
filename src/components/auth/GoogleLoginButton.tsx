
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "lucide-react";

interface GoogleLoginButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ isLoading, onClick }) => {
  return (
    <Button variant="outline" className="w-full" onClick={onClick} disabled={isLoading}>
      <ChromeIcon className="mr-2 h-4 w-4" />
      {isLoading ? "Redirecting..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleLoginButton;

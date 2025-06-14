
import { useUserRole } from '@/hooks/useUserRole';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ModeratorGuard = () => {
  const { isModerator, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isModerator) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ModeratorGuard;

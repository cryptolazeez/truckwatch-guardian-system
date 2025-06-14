
import { useAuthActions } from "@/hooks/useAuthActions";

const NotAuthorizedPage = () => {
  const { handleLogout } = useAuthActions();
  return null;
};

export default NotAuthorizedPage;

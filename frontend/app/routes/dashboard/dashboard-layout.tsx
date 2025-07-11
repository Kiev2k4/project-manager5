import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/auth-context";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <Button onClick={logout}>Logout 1</Button>
    </div>
  );
};

export default DashboardLayout;

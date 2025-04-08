import { useSelector } from "react-redux";
import ProductManagement from "../components/ProductManagement";
import UserManagement from "../components/UserManagement";
import { RootState } from "../store/store";

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";

  return <>{isAdmin ? <UserManagement /> : <ProductManagement />}</>;
};

export default Dashboard;

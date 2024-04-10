import AdminLayout from "../../layout/Admins";
import DashboardPage from "./Dashboard/components/DashboardPage";

const Dashboard = () => {
  return (
    <AdminLayout pageTitle="Dashboard">
      <DashboardPage />
    </AdminLayout>
  );
};

export default Dashboard;

import AdminLayout from "../../../layout/Admins";
import UsersPage from "./components/UsersPage";

const Users = () => {
  return (
    <AdminLayout pageTitle="All Users">
      <UsersPage />
    </AdminLayout>
  );
};

export default Users;

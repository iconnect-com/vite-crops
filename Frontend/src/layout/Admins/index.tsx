import React, { useContext, useState } from "react";
import { AuthContext } from "../../context";
import { Layout, Menu, Drawer } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayoutProps } from "../../interface";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import {
  UserOutlined,
  LogoutOutlined,
  SettingFilled,
  HomeFilled,
  UsergroupAddOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import type { GetProp, MenuProps } from "antd";

type MenuItem = GetProp<MenuProps, "items">[number];

function getMenuItem(
  label: React.ReactNode,
  path: string,
  key?: React.Key | null,
  icon?: React.ReactNode,
  type?: "group"
): MenuItem {
  return {
    key: path,
    icon,
    type,
    label: <Link to={path}>{label}</Link>,
  } as MenuItem;
}

const AdminLayout = ({ children, pageTitle }: AdminLayoutProps) => {
  const [visible, setVisible] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const showDrawer = () => {
    setVisible(!visible);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
    navigate("/");
  };

  const items: MenuItem[] = [
    getMenuItem("Dashboard", "/app/dashboard", "1", <HomeFilled />),
    getMenuItem("Configuration", "/app/configuration", "2", <SettingFilled />),
    getMenuItem("Users", "/app/users", "3", <UsergroupAddOutlined />),
    getMenuItem("Profile", "/app/profile", "4", <UserOutlined />),
    getMenuItem("Reporting", "/app/reporting", "5", <ProjectOutlined />),
    getMenuItem("Logout", "", "6", <LogoutOutlined />),
  ];

  return (
    <Layout>
      <div className="flex justify-start h-screen">
        <div
          className="bg-white py-14 px-10"
          style={{
            width: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <MenuUnfoldOutlined onClick={showDrawer} />
        </div>

        <Drawer
          placement="left"
          width={270}
          closable={false}
          onClose={onClose}
          open={visible}
          mask={true}
          maskClosable={true}
          styles={{ content: { boxShadow: "none", borderRight: "none" } }}
        >
          <Menu
            defaultOpenKeys={["sub1"]}
            className="!border-none"
            mode="inline"
            items={items}
            onClick={(item) => (item.key === "" ? handleLogout() : undefined)}
            selectedKeys={[location.pathname]}
          />
        </Drawer>
        <div className="overflow-x-hidden p-10 flex-col flex-grow">
          <Header pageTitle={pageTitle} />
          <div className=" mt-10">{children}</div>{" "}
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;

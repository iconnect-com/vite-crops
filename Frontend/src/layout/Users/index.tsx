/* eslint-disable no-restricted-globals */
import React, { useContext, useEffect } from "react";
import { LayoutProps } from "../../interface";
import { Layout, Menu, Avatar, Button, Drawer } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context";
import { useGetMe } from "../../hooks/auth";
import NotificationModal from "./components/NotificationModal";
import picture from ".././../assets/Avatar.svg";
import type { GetProp, MenuProps } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  AimOutlined,
  InfoCircleFilled,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

type MenuItem = GetProp<MenuProps, "items">[number];

function getMenuItem(
  label: React.ReactNode,
  path: string,
  key?: React.Key | null,
  icon?: React.ReactNode,
  type?: "group",
  onClick?: () => void
): MenuItem {
  return {
    key: path,
    icon,
    type,
    label: (
      <Link to={onClick ? "#" : path} onClick={onClick} className="text-sm">
        {label}
      </Link>
    ),
  } as MenuItem;
}

const { Header } = Layout;

const Layouts = ({ children, Heading, Background }: LayoutProps) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const data = useGetMe();

  useEffect(() => {
    if (data) {
      const newPicture = data?.photo;
      setPreviewImage(newPicture);
    }
  }, [data, data?.photo]);

  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
    navigate("/");
  };

  const items: MenuItem[] = [
    getMenuItem("Home", "/user/dashboard", "1", <HomeOutlined />),
    getMenuItem("Market News", "/user/market-news", "2", <AimOutlined />),
    getMenuItem("Notifications", "#", "3", <InfoCircleFilled />, "group", () =>
      setOpen(true)
    ),
    getMenuItem("Profile", "/user/profile", "4", <UserOutlined />),
    getMenuItem("Logout", "", "5", <LogoutOutlined />),
  ];

  return (
    <Layout>
      <div className="overflow-x-hidden gap-2 pb-8 bg-white ">
        <div
          className="sm:h-[230px] h-[100px] w-full flex items-start bg-cover bg-center justify-center flex-col gap-2 p-12"
          style={{
            backgroundImage: `linear-gradient(89.36deg, #39462D 38.02%, rgba(57, 70, 45, 0.24) 123.04%), url(${Background})`,
            backgroundSize: "100%, 70%",
            backgroundPosition: "center, right",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="text-4xl mb-1 font-bold text-white sm:leading-tight leading-tight">
            {Heading}
          </div>

          <div />
        </div>

        <Header className="flex justify-between w-full items-center px-12 pt-8 mb-3 bg-white">
          <div className="flex w-full items-center gap-2">
            <Avatar
              icon={<UserOutlined />}
              size={40}
              src={previewImage || picture}
            />{" "}
            <div className="flex flex-col">
              <div className="ml-2 mt-2 text-sm font-bold">
                Hello, {user?.fullname}{" "}
              </div>
              <div className="ml-2 text-sm">It’s nice seeing you again!</div>
            </div>
          </div>
          <div className="sm:hidden shadow-none">
            <Button
              type="text"
              className="shadow-none"
              onClick={showDrawer}
              icon={<MenuUnfoldOutlined style={{ color: "black" }} />}
            />
          </div>

          {/* Div for menu on pc screens*/}

          <Menu
            defaultOpenKeys={["sub1"]}
            mode="horizontal"
            className="hidden sm:flex sm:justify-end bg-transparent border-none outline-none sm:w-full"
            items={items}
            onClick={(item) => (item.key === "" ? handleLogout() : undefined)}
            selectedKeys={[location.pathname]}
          />
        </Header>
        <Drawer
          placement="right"
          width={200}
          closable={false}
          onClose={onClose}
          open={drawerVisible}
        >
          <div className="flex justify-end">
            <CloseOutlined onClick={onClose} />
          </div>

          {/* Div for menu on smaller screens*/}

          <Menu
            defaultOpenKeys={["sub1"]}
            mode="vertical"
            className="border-none"
            items={items}
            onClick={(item) => (item.key === "" ? handleLogout() : undefined)}
            selectedKeys={[location.pathname]}
          />
        </Drawer>
        <div className="bg-white px-12 pt-10">{children}</div>

        {open && (
          <NotificationModal
            onClose={() => {
              setOpen(false);
              onClose();
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default Layouts;

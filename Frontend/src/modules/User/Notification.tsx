import React, { useState } from "react";
import { Tabs, Button, List, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDeleteNotification } from "../Admin/hooks";

// interface NotificationProps {
//   message: string;
//   notification: string;
//   id?: string;
//   _id?: string;
//   key?: any;
//   item?: any;
// }

interface DataItem {
  id: string;
  title: string;
  body: number;
  status: string;
}

const Notification = () => {
  const initialData: DataItem[] = [
    {
      id: "1",
      title: "John Brown",
      body: 32,
      status: "New",
    },
    {
      id: "2",
      title: "Jim Green",
      body: 42,
      status: "Read",
    },
    {
      id: "3",
      title: "Joe Black",
      body: 32,
      status: "Read",
    },
  ];

  const { mutate: Delete } = useDeleteNotification();
  const [visible, setVisible] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [notifications, setNotifications] = useState<DataItem[]>(initialData);
  const [open, setOpen] = useState(false);

  const handleOpen = (item: DataItem) => {
    setVisible(true);
    setDeleteId(item.id);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      // Delete(deleteId as string);
    }
    setVisible(false);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.status === "New") {
        return { ...notification, status: "Read" };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };

  return (
    <div>
      {/* <Layouts Heading="Notifications" Background={backs}> */}
      <Modal
        title="Modal 1000px width"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <div className="flex justify-end">
          {" "}
          <Button
            style={{ backgroundColor: "#65812729", color: "#658127" }}
            className="mb-4 text-sm sm:text-md"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </div>

        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="All" key="1">
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      onClick={() => handleOpen(item)}
                      style={{ backgroundColor: "#E3362930", color: "#E33629" }}
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta title={item.title} description={item.body} />
                </List.Item>
              )}
            />{" "}
          </Tabs.TabPane>
          <Tabs.TabPane tab="New" key="2">
            <List
              itemLayout="horizontal"
              dataSource={notifications.filter((item) => item.status === "New")}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      onClick={() => handleOpen(item)}
                      style={{ backgroundColor: "#E3362930", color: "#E33629" }}
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta title={item.title} description={item.body} />
                </List.Item>
              )}
            />{" "}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Read" key="3">
            <List
              itemLayout="horizontal"
              dataSource={notifications.filter(
                (item) => item.status === "Read"
              )}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      onClick={() => handleOpen(item)}
                      style={{ backgroundColor: "#E3362930", color: "#E33629" }}
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta title={item.title} description={item.body} />
                </List.Item>
              )}
            />{" "}
          </Tabs.TabPane>
        </Tabs>

        <Modal
          title="Delete Notification"
          open={visible}
          onOk={handleDelete}
          onCancel={handleClose}
          okButtonProps={{
            // loading: confirmLoading,
            className: "!bg-[#39462D]",
          }}
        />
      </Modal>

      {/* </Layouts> */}
    </div>
  );
};

export default Notification;

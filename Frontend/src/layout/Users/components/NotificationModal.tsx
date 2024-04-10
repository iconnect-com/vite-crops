import { DeleteOutlined } from "@ant-design/icons";
import { Button, List, Modal, Tabs, TabsProps } from "antd";
import React, { useState } from "react";
import { useGetAllNotification } from "../../../modules/Admin/hooks";

interface DataItem {
  id: string;
  _id: string;
  title: string;
  body: number;
  status: string;
  name: string;
  current_price: string;
  previous_price: string;
}

const NotificationModal = ({ onClose }: { onClose: Function }) => {
  const { data: notification } = useGetAllNotification();
  const [notifications, setNotifications] = useState<DataItem[]>(
    notification || []
  );
  const [visible, setVisible] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   setNotifications(
  //     Array.isArray(notification) ? notification : [notification]
  //   );
  // }, [notification]);

  React.useEffect(() => {
    if (notification) {
      setNotifications(
        Array.isArray(notification) ? notification : [notification]
      );
    }
  }, [notification]);

  const handleMarkAllAsRead = () => {
    if (Array.isArray(notifications)) {
      const updatedNotifications = notifications?.map((notification) => {
        if (notification?.status === "New") {
          return { ...notification, status: "Read" };
        }
        return notification;
      });
      setNotifications(updatedNotifications);
    }
  };

  const handleOpen = (item: DataItem) => {
    setVisible(true);
    setDeleteId(item.id);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      // Delete(deleteId);
    }
    setVisible(false);
  };

  // const renderItem = (item: DataItem) => (
  //   <List.Item
  //     key={item.id}
  //     actions={[
  //       <Button
  //         onClick={() => handleOpen(item)}
  //         style={{
  //           backgroundColor: "#E3362930",
  //           color: "#E33629",
  //         }}
  //         icon={<DeleteOutlined />}
  //       >
  //         Delete
  //       </Button>,
  //     ]}
  //   >
  //     <div>
  //       {notifications?.map((n) => (
  //         <div key={n.id}>
  //           <div className="font-bold text-md mt-1 flex">New Price Alert</div>
  //           <div className="mt-2 text-sm">
  //             The price of <span className="font-bold ">{n?.name}</span> has
  //             changed from NGN {n?.previous_price} to NGN {n?.current_price}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //     {/* <List.Item title={item.name} description={item.body} /> */}
  //   </List.Item>
  // );

  const renderItem = (item: DataItem) => (
    <List.Item
      key={item.id}
      actions={[
        <Button
          onClick={() => handleOpen(item)}
          style={{
            backgroundColor: "#E3362930",
            color: "#E33629",
          }}
          icon={<DeleteOutlined />}
        >
          Delete
        </Button>,
      ]}
    >
      <div>
        <div className="font-bold text-md mt-1 flex">New Price Alert</div>
        <div className="mt-2 text-sm">
          The price of <span className="font-bold ">{item?.name}</span> has
          changed from NGN {item?.previous_price} to NGN {item?.current_price}
        </div>
      </div>
    </List.Item>
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All",
      children: (
        <List
          itemLayout="horizontal"
          dataSource={Array.isArray(notifications) ? notifications : []}
          renderItem={renderItem}
        />
      ),
    },
    {
      key: "2",
      label: "New",
      children: (
        <List
          itemLayout="horizontal"
          dataSource={
            Array.isArray(notifications)
              ? notifications.filter((item) => item?.status === "New")
              : []
          }
          renderItem={renderItem}
        />
      ),
    },
    {
      key: "3",
      label: "Read",
      children: (
        <List
          itemLayout="horizontal"
          dataSource={
            Array.isArray(notifications)
              ? notifications.filter((item) => item?.status === "Read")
              : []
          }
          renderItem={renderItem}
        />
      ),
    },
  ];

  return (
    <Modal
      open
      title="Notifications"
      width={1000}
      footer={null}
      onCancel={() => {
        onClose();
      }}
    >
      <div>
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

        <Tabs defaultActiveKey="1" items={items} />

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
      </div>
    </Modal>
  );
};

export default NotificationModal;

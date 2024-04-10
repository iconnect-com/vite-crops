import React, { useState } from "react";
import { Button, Space, Modal, Table, Popconfirm } from "antd";
import type { TablePaginationConfig, TableProps } from "antd";
import { useIsFetching } from "@tanstack/react-query";
import { useDeleteUser, useGetAllUsers } from "../../hooks/auth";
import eye from "../../assets/Vector (3).png";
import trash from "../../assets/material-symbols_delete-outline.png";
import { useNavigate } from "react-router";
import { successAlert } from "../../utils";
import Pics from "../../assets/fluent_weather-haze-24-filled (1).png";
import LayoutSAdmin from "../../layout/Super Admins";

interface DataType {
  key: string;
  fullname: string;
  address: string;
  phone: string;
  status: string;
  email: string;
  id: any;
  _id: any;
}

const AllAdmin = () => {
  const { data: allAdmins } = useGetAllUsers();
  const Admins = allAdmins?.filter((user: any) => user?.role === "Admin");

  const loading = useIsFetching();
  const [selectedUser, setSelectedUser] = React.useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [ModalOpen, setModalOpen] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const showPopconfirm = (record: DataType) => {
    setSelectedUser(record);
    setOpen(true);
  };

  const { mutate, isSuccess, reset } = useDeleteUser();
  if (isSuccess) {
    reset();
    successAlert("User deleted successfully");
  }

  const handleCancel = () => {
    setOpen(false);
  };

  // Modal control for Deleting user
  const showModal = (record: DataType) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
    if (selectedUser) {
      setOpen(false);
      mutate(selectedUser?._id);
    }
  };

  const showModals = (record: DataType) => {
    setSelectedUser(record);
    setModalOpen(true);
  };

  const handleOK = () => {
    setModalOpen(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "S/N",
      dataIndex: "number",
      width: 80,
      align: "center",
      key: "number",
      render: (text, record, index) => {
        const pageNumber = tableProps.current || 1;
        const pageSize = tableProps.pageSize || 5;
        return (pageNumber - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      align: "left",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <img
            src={eye}
            alt="View"
            style={{ width: "20px", cursor: "pointer" }}
            onClick={() => showModals(record)}
          />
          <img
            src={trash}
            alt="Delete"
            style={{ width: "20px", cursor: "pointer" }}
            onClick={() => showPopconfirm(record)}
          />
        </Space>
      ),
    },
  ];

  const [tableProps, setTableProps] = useState<TablePaginationConfig>({
    pageSize: 5,
  });

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableProps(pagination);
  };

  return (
    <LayoutSAdmin Heading="All Admins" Background={Pics}>
      <div className="gap-4 mb-4 overflow-auto w-full">
        <Button
          onClick={handleGoBack}
          type="text"
          className="w-30 h-10 mb-4"
          style={{
            background: "#65812729",
            color: "black",
            borderRadius: "50px",
            boxShadow: "none",
          }}
        >
          Back{" "}
        </Button>
        <Table
          size="middle"
          columns={columns}
          dataSource={Admins}
          loading={!!loading}
          rowKey="_id"
          onChange={onChange}
          pagination={{
            ...tableProps,
            pageSizeOptions: ["5", "10", "15"],
            showSizeChanger: false,
          }}
        />

        <Modal
          title="Are you sure?"
          open={open}
          onOk={handleOk}
          okButtonProps={{ loading: confirmLoading }}
          onCancel={handleCancel}
          width={400}
          centered
        >
          <div className="mt-5 ">
            <p className="mb-4">
              {" "}
              Do you want to delete{" "}
              <span style={{ fontWeight: "bold" }}>
                {selectedUser?.fullname}?
              </span>
            </p>
          </div>
        </Modal>
        <div>
          <Modal
            title="View User"
            open={ModalOpen}
            onOk={handleOK}
            onCancel={handleClose}
            width={500}
            centered
            footer={null}
          >
            <div
              className="mt-6 grid sm:grid-cols-1 md:grid-cols-2 gap-6 w-full"
              style={{ marginBottom: "3rem", marginTop: "3rem" }}
            >
              <div className="mt-15 ">
                <h5 className="mb-1 font-bold">Full Name</h5>
                <p className="mb-4">{selectedUser?.fullname}</p>
              </div>

              <div className="sm:ml-8 mt-15">
                <h5 className="mb-1 font-bold">Email Address</h5>
                <p className="mb-4">{selectedUser?.email}</p>
              </div>

              <div className="mt-15 ">
                <h5 className="mb-1 font-bold">Phone Number</h5>
                <p className="mb-4">{selectedUser?.phone || ""}</p>
              </div>

              <div className="sm:ml-8 mt-15">
                <h5 className="mb-1 font-bold">Status</h5>
                <p className="mb-4">{selectedUser?.status}</p>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </LayoutSAdmin>
  );
};

export default AllAdmin;

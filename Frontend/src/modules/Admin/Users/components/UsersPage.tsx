import React, { useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Table,
  Space,
  TableColumnsType,
  Modal,
  Button,
  TablePaginationConfig,
  TableProps,
} from "antd";
import eye from "../../../../assets/Vector (3).png";
import trash from "../../../../assets/material-symbols_delete-outline.png";
import { useNavigate } from "react-router-dom";
import { useIsFetching } from "@tanstack/react-query";
import { useDeleteUser, useGetAllUsers } from "../../../../hooks/auth";
import { successAlert } from "../../../../utils";

interface DataType {
  _id: any;
  key: any;
  number: number;
  fullname: string;
  email: string;
  phone: number;
  date_of_birth: number;
  address: string;
  dob: string;
  actions: React.ReactNode;
  status: string;
}

const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [ModalOpen, setModalOpen] = React.useState(false);
  const loading = useIsFetching();
  const allUsers = useGetAllUsers();

  const Users = allUsers?.data;
  const UsersOnly = Users?.filter((user: any) => user.role === "User");

  const [selectedUser, setSelectedUser] = React.useState<DataType | null>(null);
  const { mutate, isSuccess, reset } = useDeleteUser();
  if (isSuccess) {
    reset();
    successAlert("User deleted successfully");
  }

  // Modal control for Deleting user
  const showModal = (record: DataType) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (selectedUser) {
      setIsModalOpen(false);
      mutate(selectedUser?._id);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Modal control for view
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

  const columns: TableColumnsType<DataType> = [
    {
      title: "S/N",
      dataIndex: "number",
      width: 80,
      align: "center",
      render: (text, record, index) => {
        const pageNumber = tableProps.current || 1;
        const pageSize = tableProps.pageSize || 5;
        return (pageNumber - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Name",
      dataIndex: "fullname",
      align: "left",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
      filters: UsersOnly?.map((c: any) => ({
        text: c?.fullname,
        value: c?.fullname,
        key: c?._id,
      })),

      filterMode: "menu",
      filterSearch: true,
      onFilter: (value: React.Key | boolean, record: DataType) => {
        if (typeof value === "string") {
          return record?.fullname.includes(value);
        }
        return false;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "left",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Phone No",
      dataIndex: "phone",
      align: "left",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },

    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      align: "left",
      width: 150,
      render: (text) => {
        const date = text?.split("T")[0];
        return (
          <div
            style={{ height: "40px", display: "flex", alignItems: "center" }}
          >
            {date}
          </div>
        );
      },
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
            onClick={() => showModal(record)}
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
    <div>
      <Button
        onClick={handleGoBack}
        type="text"
        className="w-30 h-10 mb-6"
        style={{
          background: "#65812729",
          color: "black",
          borderRadius: "50px",
          boxShadow: "none",
        }}
      >
        Back{" "}
      </Button>
      <div className="flex-col gap-4 mb-4 overflow-auto w-full">
        <div className="relative inline-block text-left"></div>

        <div className="">
          <Table
            columns={columns}
            dataSource={UsersOnly}
            size="middle"
            rowKey="_id"
            loading={!!loading}
            onChange={onChange}
            pagination={{
              ...tableProps,
              pageSizeOptions: ["5", "10", "15"],
              showSizeChanger: false,
            }}
          />
        </div>

        <Modal
          title="Confirm"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {selectedUser && (
            <>
              <p>
                <ExclamationCircleOutlined /> Are you sure you want to delete
                user, {selectedUser?.fullname}?
              </p>
            </>
          )}
        </Modal>

        <div>
          <Modal
            title="View User"
            open={ModalOpen}
            onOk={handleOK}
            onCancel={handleClose}
            width={300}
            // footer={null}
            // centered
          >
            <div className="mt-7 ">
              <h5 className="mb-1 font-bold">Full Name</h5>
              <p className="mb-4">{selectedUser?.fullname}</p>
            </div>
            <div className="mt-1 ">
              <h5 className="mb-1 font-bold">Email</h5>
              <p className="mb-4">{selectedUser?.email}</p>
            </div>
            <div className="mt-1 ">
              <h5 className="mb-1 font-bold">Phone </h5>
              <p className="mb-4">{selectedUser?.phone}</p>
            </div>
            <div className="mt-1 ">
              <h5 className="mb-1 font-bold">Data of Birth</h5>
              <p className="mb-4">{selectedUser?.date_of_birth}</p>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;

import React, { useState } from "react";
import { Table, Space, Modal, Button } from "antd";
import eye from "../../../../assets/Vector (3).png";
import trash from "../../../../assets/material-symbols_delete-outline.png";
import type { TablePaginationConfig, TableProps } from "antd";
import AdminLayout from "../../../../layout/Admins";
import { useNavigate } from "react-router-dom";
import { useDeleteCommodity, useGetAllCommodity } from "../../hooks";
import { useIsFetching } from "@tanstack/react-query";

interface DataType {
  index: number;
  quality_information: string;
  name: string;
  previous_price: string;
  current_price: string;
  analysis: string;
  image: string;
  id: any;
  _id: any;
}

const AllCommodity: React.FC = () => {
  const commodities = useGetAllCommodity();
  const mappedData = commodities?.map((item: any, index: any) => ({
    ...item,
    index,
  }));
  const loading = useIsFetching();

  const [commodity, setCommodity] = React.useState<DataType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { mutate: Delete } = useDeleteCommodity();
  const [deleteCommodity, setDeleteCommodity] = React.useState<DataType | null>(
    null
  );
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleEyeClick = (record: DataType) => {
    setCommodity(record);
    setModalVisible(true);
  };

  const handleOK = () => {
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const showPopconfirm = (record: DataType) => {
    setDeleteCommodity(record);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
    if (deleteCommodity) {
      setOpen(false);
      Delete(deleteCommodity._id);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
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
      title: "Title",
      dataIndex: "name",
      align: "left",
      width: 250,
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            maxHeight: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Previous Price",
      dataIndex: "previous_price",
      align: "left",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Current Price",
      dataIndex: "current_price",
      align: "left",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Analysis",
      dataIndex: "analysis",
      align: "left",
      width: 800,
      render: (text) => (
        <div
          style={{
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxHeight: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
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
            style={{ width: "20px", cursor: "pointer", alignItems: "center" }}
            onClick={() => handleEyeClick(record)}
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
    <AdminLayout pageTitle="All Commodity">
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
      <div className="h-full mx-auto pr-0 sm:pr-9 w-full overflow-auto">
        <Table
          columns={columns}
          dataSource={mappedData}
          size="middle"
          loading={!!loading}
          rowKey="_id"
          onChange={onChange}
          pagination={{
            ...tableProps,
            pageSizeOptions: ["5", "10", "15"],
            showSizeChanger: false,
          }}
        />

        <div>
          <Modal
            title="View Commodity Detail"
            open={modalVisible}
            onOk={handleOK}
            onCancel={handleClose}
            width={500}
            centered
            footer={null}
          >
            <>
              <img
                alt="User"
                style={{
                  width: "100%",
                  height: "50%",
                  // objectFit: "",
                }}
                src={commodity?.image}
              />
            </>
            <div
              className="mt-6 grid sm:grid-cols-1 md:grid-cols-2 gap-6 w-full"
              style={{ marginBottom: "3rem", marginTop: "3rem" }}
            >
              <div className="mt-15 ">
                <h5 className="mb-1 font-bold">Name</h5>
                <p className="mb-4">{commodity?.name}</p>
              </div>
              <div className="mt-15 ">
                <h5 className="mb-1 font-bold">Previous Price</h5>
                <p className="mb-4">{commodity?.previous_price}</p>
              </div>
              <div className="mt-15 ">
                <h5 className="mb-1 font-bold">Current Price</h5>
                <p className="mb-4">{commodity?.current_price}</p>
              </div>
              <div className="mt-15 ">
                <h5 className="mb-1 font-bold">Analysis</h5>
                <p className="mb-4">{commodity?.analysis}</p>
              </div>
            </div>
          </Modal>
        </div>
        <Modal
          title="Are you sure?"
          open={open}
          onOk={handleOk}
          okButtonProps={{
            loading: confirmLoading,
            className: "!bg-[#39462D]",
          }}
          onCancel={handleCancel}
          width={400}
          centered
        >
          <div className="mt-5 ">
            <p className="mb-4">
              {" "}
              Do you want to delete commodity{" "}
              <span style={{ fontWeight: "bold" }}>
                {deleteCommodity?.name}?
              </span>
            </p>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AllCommodity;

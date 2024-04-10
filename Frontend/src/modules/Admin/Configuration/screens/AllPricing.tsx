import React, { useState } from "react";
import { Table, Space, Modal, Button } from "antd";
import { useDeleteConfiguration, useGetConfiguration } from "../../hooks";
import eye from "../../../../assets/Vector (3).png";
import trash from "../../../../assets/material-symbols_delete-outline.png";
import type { TablePaginationConfig, TableProps } from "antd";
import AdminLayout from "../../../../layout/Admins";
import { useNavigate } from "react-router-dom";
import { useIsFetching } from "@tanstack/react-query";

interface CommodityType {
  id: any;
  _id: any;
  name: string;
}

interface DataType {
  index: number;
  reason_for_change: string;
  effective_date: string;
  effective_time: string;
  previous_price: string;
  new_price: string;
  status: string;
  name: string;
  commodity: CommodityType;
  id: any;
  _id: any;
}

const AllPricing: React.FC = () => {
  const { data: Pricing } = useGetConfiguration();
  const loading = useIsFetching();
  const [showPrice, setShowPrice] = React.useState<DataType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { mutate: Delete } = useDeleteConfiguration();
  const [deleteConfiguration, setDeleteConfiguration] =
    React.useState<DataType | null>(null);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const mappedData = Pricing?.map((item: any, index: any) => ({
    ...item,
    index,
  }));

  const handleEyeClick = (record: DataType) => {
    setShowPrice(record);
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
    setDeleteConfiguration(record);
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
    if (deleteConfiguration) {
      setOpen(false);
      Delete(deleteConfiguration?._id);
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
      title: "Commodity",
      dataIndex: "commodity",
      align: "left",
      width: 150,
      render: (text, record) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text?.name}
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
          {text.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Current Price",
      dataIndex: "new_price",
      align: "left",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Effective Date",
      dataIndex: "effective_date",
      align: "left",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Effective Time",
      dataIndex: "effective_time",
      align: "left",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "left",
      width: 150,
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
    <AdminLayout pageTitle="All Price History">
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
          rowKey="_id"
          loading={!!loading}
          onChange={onChange}
          pagination={{
            ...tableProps,
            pageSizeOptions: ["5", "10", "15"],
            showSizeChanger: false,
          }}
        />

        <div>
          <Modal
            title="View Pricing Details"
            open={modalVisible}
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
                <h5 className="mb-1 font-bold">Name</h5>
                <p className="mb-4">{showPrice?.commodity?.name}</p>
              </div>

              <div className="sm:ml-8 mt-15">
                <h5 className="mb-1 font-bold">Effect Date</h5>
                <p className="mb-4">{showPrice?.effective_date}</p>
              </div>

              <div className="mt-15 ">
                <h5 className="mb-1 font-bold">Effect Time</h5>
                <p className="mb-4">{showPrice?.effective_time}</p>
              </div>

              <div className="sm:ml-8 mt-15">
                <h5 className="mb-1 font-bold">Prev Price</h5>
                <p className="mb-4">{showPrice?.previous_price}</p>
              </div>

              <div className="mt-15 ">
                <h5 className="mb-1 font-bold">New Price</h5>
                <p className="mb-4">{showPrice?.new_price}</p>
              </div>

              <div className="sm:ml-8 mt-15">
                <h5 className="mb-1 font-bold">Info</h5>
                <p className="mb-4">{showPrice?.reason_for_change}</p>
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
                {deleteConfiguration?.commodity?.name}?
              </span>
            </p>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AllPricing;

import React, { useState } from "react";
import { Table, Space, Modal, Button, Menu, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useDeleteNews, useGetAllNews } from "../../hooks";
import eye from "../../../../assets/Vector (3).png";
import edit from "../../../../assets/bxs_edit.png";
import trash from "../../../../assets/material-symbols_delete-outline.png";
import type { TablePaginationConfig, TableProps } from "antd";
import AdminLayout from "../../../../layout/Admins";
import { useNavigate } from "react-router-dom";
import { decode } from "html-entities";
import { useIsFetching } from "@tanstack/react-query";
import type { MenuProps } from "antd";

interface DataType {
  index: number;
  description: string;
  title: string;
  image: string;
  id: any;
  _id: any;
}

const AllNews: React.FC = () => {
  const { mutate: Delete } = useDeleteNews();
  const [showNews, setShowNews] = React.useState<DataType | null>(null);
  const [deleteNews, setDeletenews] = React.useState<DataType | null>(null);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const loading = useIsFetching();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: AllNews } = useGetAllNews();

  React.useEffect(() => {
    if (AllNews) {
      const mapped = AllNews.map((item: any, index: any) => ({
        ...item,
        index,
      }));
      setMappedData(mapped);
    }
  }, [AllNews]);

  const [mappedData, setMappedData] = useState<DataType[]>([]);

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEyeClick = (record: DataType) => {
    setShowNews(record);
    setModalVisible(true);
  };

  const handleEditClick = (record: DataType) => {
    const id = record._id;
    navigate(`/app/configuration/market-news/${id}`, { state: { record } });
  };

  const handleOK = () => {
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const showPopconfirm = (record: DataType) => {
    setDeletenews(record);
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
    if (deleteNews) {
      setOpen(false);
      Delete(deleteNews?._id);
    }
  };

  const decodedHtml = decode(showNews?.description || "");

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
      dataIndex: "title",
      align: "left",
      width: 250,
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxHeight: "40px",
            height: "40px",
            width: "150px", // Adjust this value as needed
            display: "flex",
            alignItems: "center",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Quality Information",
      dataIndex: "description",
      align: "left",
      width: 800,
      render: (text) => {
        const decodedHtml = decode(text || "");
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxHeight: "40px",
              height: "40px",
              width: "300px", // Adjust this value as needed
              display: "flex",
              alignItems: "center",
            }}
            dangerouslySetInnerHTML={{ __html: decodedHtml || "" }}
          />
        );
      },
    },

    {
      title: "Actions",
      dataIndex: "actions",
      align: "center",
      width: 150,
      render: (_, record) => {
        const items: MenuProps["items"] = [
          {
            key: "1",
            label: (
              <div
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => handleEyeClick(record)}
              >
                <img
                  src={eye}
                  alt="View"
                  style={{ width: "20px", marginRight: "5px" }}
                />
                View
              </div>
            ),
          },
          {
            key: "2",
            label: (
              <div
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => handleEditClick(record)}
              >
                <img
                  src={edit}
                  alt="Edit"
                  style={{ width: "20px", marginRight: "5px" }}
                />
                Edit
              </div>
            ),
          },
          {
            key: "3",
            label: (
              <div
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => showPopconfirm(record)}
              >
                <img
                  src={trash}
                  alt="Delete"
                  style={{ width: "20px", marginRight: "5px" }}
                />
                Delete
              </div>
            ),
          },
        ];

        return (
          <Space direction="vertical">
            <Space wrap>
              <Dropdown
                trigger={["click"]}
                menu={{ items }}
                placement="bottomLeft"
              >
                <MoreOutlined />
                {/* <Button>Actions</Button> */}
              </Dropdown>
            </Space>
          </Space>
        );
      },
    },
  ];

  return (
    <AdminLayout pageTitle="All News">
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
            title="View News Detail"
            open={modalVisible}
            onOk={handleOK}
            onCancel={handleClose}
            width={600}
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
                src={showNews?.image}
              />
            </>

            <div
              className="mt-6 grid grid-col gap-6"
              style={{ marginBottom: "3rem", marginTop: "3rem" }}
            >
              <div className="mt-15">
                <h5 className="mb-1 font-bold">Name</h5>
                <p className="mb-4">{showNews?.title}</p>
              </div>

              <div
                className="mt-15"
                style={{ maxWidth: "100%", wordWrap: "break-word" }}
              >
                <h5 className="mb-1 font-bold">Quality Information</h5>

                <div
                  className="mb-4"
                  style={{ maxWidth: "100%", overflowWrap: "break-word" }}
                  dangerouslySetInnerHTML={{ __html: decodedHtml || "" }}
                />
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
              <span style={{ fontWeight: "bold" }}>{deleteNews?.title}?</span>
            </p>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AllNews;

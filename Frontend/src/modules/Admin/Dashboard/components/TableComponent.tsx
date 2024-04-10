import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Input,
  Button,
  Form,
  Modal,
  Tag,
  DatePicker,
  TimePicker,
} from "antd";
import type {
  DatePickerProps,
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd";
import eye from "../../../../assets/Vector (3).png";
import trash from "../../../../assets/material-symbols_delete-outline.png";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { CloseOutlined } from "@ant-design/icons";
import {
  useDeleteConfiguration,
  useGetConfiguration,
  useUpdateCommodityPrice,
} from "../../hooks";
import type { TimePickerProps } from "antd";
import { Dayjs } from "dayjs";
import { successAlert } from "../../../../utils";

interface FormData {
  commodity: any;
  previous_price: string;
  new_price: string;
  effective_date: string;
  effective_time: string;
  reason_for_change: string;
  tags: string[];
  name: any;
}
interface DataType {
  key: any;
  status: string;
  name: any;
  commodity: any;
  new_price: string;
  current_price: string;
  previous_price: any;
  effective_date: any;
  effective_time: string;
  reason_for_change: string;
  tags: string[];
  dateString: any;
  id: any;
  _id: any;
}
type PickerType = "time" | "date";

const TableComponent = () => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [configuration, setConfiguration] = React.useState<DataType | null>(
    null
  );
  const { mutate } = useUpdateCommodityPrice(configuration?._id);
  const { mutate: Delete } = useDeleteConfiguration();
  const { data: MarketPrices } = useGetConfiguration();

  React.useEffect(() => {
    if (MarketPrices) {
      const mapped = MarketPrices.map((item: any, index: any) => ({
        ...item,
        index,
      }));
      setMappedData(mapped);
      setFilterData(mapped);
    }
  }, [MarketPrices]);

  const [mappedData, setMappedData] = useState<DataType[] | null>(null);
  const [filterData, setFilterData] = useState<DataType[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const loading = useIsFetching();

  const isLoading = useIsMutating();
  const [form] = Form.useForm();

  const [showCalendar, setShowCalendar] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    commodity: "",
    previous_price: "",
    new_price: "",
    effective_date: "",
    effective_time: "",
    reason_for_change: "",
    tags: [],
    name: "",
  });

  const handleEyeClick = (record: DataType) => {
    setConfiguration(record);
    setIsOpen(true);
    setModalVisible(true);
  };

  const showPopconfirm = (record: DataType) => {
    setConfiguration(record);
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
    if (configuration) {
      setOpen(false);
      Delete(configuration?._id);
    }
  };

  useEffect(() => {
    if (configuration) {
      form.setFieldsValue({
        commodity: configuration?.commodity?.name,
        previous_price: configuration?.new_price,
      });
    }
  }, [configuration, form]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (
    date: Dayjs | null,
    dateString: string | string[]
  ) => {
    if (dateString) {
      const filteredData = mappedData?.filter(
        (item: DataType) => item.effective_date === dateString
      );
      setFilterData(filteredData || []);
    } else {
      setFilterData([]);
    }
    setShowCalendar(false);
  };

  const handleDateInput = (
    value: DatePickerProps["value"],
    dateString: string | string[]
  ) => {
    if (typeof dateString === "string") {
      setFormData({
        ...formData,
        effective_date: dateString ? dateString : "",
      });
    }
  };
  const handleTimeChange = (
    value: TimePickerProps["value"],
    timeString: string | string[]
  ) => {
    if (typeof timeString === "string") {
      setFormData({
        ...formData,
        effective_time: timeString ? timeString : "",
      });
    }
  };

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

  const columns: TableColumnsType<DataType> = [
    {
      title: "S/N",
      dataIndex: "number",
      width: 80,
      key: "number",
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
      key: "name",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text?.name || ""}
        </div>
      ),

      filters: mappedData
        ?.map((c: any) => c?.commodity?.name)
        .filter(
          (value: string, index: number, self: string[]) =>
            self.indexOf(value) === index
        )
        .map((name: string) => ({
          text: name,
          value: name,
        })),

      filterMode: "menu",
      filterSearch: true,
      onFilter: (value: React.Key | boolean, record: DataType) => {
        if (typeof value === "string") {
          return record?.commodity?.name.includes(value);
        }
        return false;
      },
    },
    {
      title: "Previous Price",
      dataIndex: "previous_price",
      align: "left",
      key: "previous_price",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text?.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Current Price",
      dataIndex: "new_price",
      align: "left",
      key: "current_price",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text?.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Effective Date",
      dataIndex: "effective_date",
      align: "left",
      width: 150,
      key: "effective_date",
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
      key: "effective_time",
      width: 150,
      render: (text) => {
        const [hours, minutes] = text?.split(":");
        const hourNumber = Number(hours);
        const formattedTime = `${
          hourNumber > 12 ? hourNumber - 12 : hourNumber
        }:${minutes} ${hourNumber >= 12 ? "PM" : "AM"}`;

        return (
          <div
            style={{ height: "40px", display: "flex", alignItems: "center" }}
          >
            {formattedTime}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "left",
      key: "status",
      width: 150,
      render: (status) => {
        let color;
        if (status === "Pending") {
          color = "red";
        } else if (status === "Completed") {
          color = "green";
        } else {
          color = "red";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        {
          text: "Pending",
          value: "Pending",
        },
        {
          text: "Completed",
          value: "Completed",
        },
      ],

      filterMode: "menu",

      onFilter: (value: React.Key | boolean, record: DataType) => {
        if (typeof value === "string") {
          return record.status === value;
        }
        return false;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "left",
      key: "action",
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

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const {
      previous_price,
      new_price,
      effective_date,
      effective_time,

      reason_for_change,
    } = formData;
    const data = new FormData();
    data.append("commodity", configuration?._id);
    data.append("previous_price", configuration?.previous_price);
    data.append("new_price", new_price);
    data.append("effective_date", effective_date);
    data.append("effective_time", effective_time);
    data.append("reason_for_change", reason_for_change);
    await mutate(data as any);
    successAlert("commodity Updated Successfully");
    handleClose();
    form.resetFields();
    setModalVisible(false);
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 mt-4">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="relative flex items-center justify-center gap-2 bg-[#658127] bg-opacity-10 rounded-md py-2 px-4"
        >
          <p className="text-[#658127] text-[16px] font-medium">
            Price history
          </p>
          <span className="w-6 h-6 flex items-center justify-center">
            <svg
              width="10"
              height="6"
              className={`transform ${showCalendar ? "rotate-180" : ""}`}
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.99984 5.99975L0.756836 1.75775L2.17184 0.34375L4.99984 3.17175L7.82784 0.34375L9.24284 1.75775L4.99984 6.00075V5.99975Z"
                fill="#658127"
              />
            </svg>
          </span>
        </button>
        <button
          style={{
            outline: "1px solid #658127",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
          }}
          onClick={() => setFilterData(mappedData || [])}
        >
          Reset Filter
        </button>
      </div>
      {showCalendar && (
        <>
          <DatePicker
            open={showCalendar}
            onChange={handleDateChange}
            className="border-gray-300 rounded-none"
            name="effective_date"
            style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
          />
        </>
      )}

      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={filterData}
          size="middle"
          rowKey="_id"
          loading={!!loading}
          onChange={onChange}
          pagination={{
            pageSizeOptions: ["5", "10", "15"],
            defaultPageSize: 5,
            showSizeChanger: false,
          }}
        />

        {modalVisible && (
          <div className="fixed inset-0 flex items-end justify-end bg-black bg-opacity-50 z-10">
            <div className="bg-white p-12 rounded-md w-[400px] h-screen relative">
              <CloseOutlined
                className="absolute text-[12px] top-16 right-8 cursor-pointer"
                onClick={handleClose}
              />
              <h2 className="mb-14 font-inter font-medium text-xl">
                Price Configuration
              </h2>
              <Form
                name="configuration-form"
                className="bg-white w-full"
                form={form}
                onFinish={mutate}
                requiredMark={false}
                variant="borderless"
                layout="vertical"
                size="middle"
                scrollToFirstError={true}
              >
                <Form.Item
                  name="commodity"
                  label="Commodity"
                  rules={[
                    { required: true, message: "Please input a Commodity" },
                  ]}
                >
                  <Input
                    readOnly
                    className="border-gray-300 rounded-none"
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  />
                </Form.Item>

                <Form.Item
                  name="previous_price"
                  label="Previous Price"
                  rules={[{ required: true, message: "Please input a price" }]}
                >
                  <Input
                    onChange={handleInputChange}
                    className="border-gray-300 rounded-none"
                    name="previous_price"
                    readOnly
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  />
                </Form.Item>

                <Form.Item
                  name="new_price"
                  label="New Price"
                  rules={[{ required: true, message: "Please input a price" }]}
                >
                  <Input
                    onChange={handleInputChange}
                    className="border-gray-300 rounded-none"
                    name="new_price"
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  />
                </Form.Item>

                <div className="flex">
                  <Form.Item
                    name="effective_date"
                    label="Effective Date"
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
                  >
                    <DatePicker
                      onChange={handleDateInput}
                      className="border-gray-300 rounded-none"
                      name="effective_date"
                      style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="effective_time"
                    label="Effective Time"
                    className="ml-8"
                    rules={[
                      { required: true, message: "Please select a time" },
                    ]}
                  >
                    <TimePicker
                      type="time"
                      onChange={handleTimeChange}
                      className="border-gray-300 rounded-none "
                      name="effective_time"
                      style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  name="reason_for_change"
                  label="Reason for change"
                  rules={[
                    {
                      required: true,
                      message: "Please input a reason for change",
                    },
                  ]}
                >
                  <Input
                    onChange={handleInputChange}
                    className="border-gray-300 rounded-none"
                    name="reason_for_change"
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  />
                </Form.Item>

                <div className="text-left">
                  <Form.Item>
                    <Button
                      onClick={handleSubmit}
                      name="submit"
                      type="primary"
                      htmlType="submit"
                      className=" w-40rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
                      style={{
                        background:
                          "linear-gradient(89.46deg, #39462D 13.05%, #658127 107.23%)",
                        color: "white",
                      }}
                      loading={isLoading > 0}
                    >
                      Revert{" "}
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        )}

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
                {configuration?.commodity?.name}?
              </span>
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TableComponent;

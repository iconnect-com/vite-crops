import React, { useState, useContext } from "react";
import { Form, Input, Button, Select } from "antd";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { useAddConfiguration, useGetConfiguration } from "../../hooks";
import { DataContext } from "../../../../context/DataContext";
import { Link } from "react-router-dom";

interface FormData {
  commodity: string;
  previous_price: string;
  new_price: string;
  effective_date: string;
  effective_time: string;
  reason_for_change: string;
}

const Price = () => {
  const { mutate } = useAddConfiguration();
  const isLoading = useIsMutating();
  const [form] = Form.useForm();
  const { publicCommodities } = useContext(DataContext);
  const [formData, setFormData] = useState<FormData>({
    commodity: "",
    previous_price: "",
    new_price: "",
    effective_date: "",
    effective_time: "",
    reason_for_change: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    const selectedCommodity = publicCommodities?.find(
      (commodity) => commodity._id === value
    );
    if (selectedCommodity?.previous_price) {
      form.setFieldsValue({ previous_price: selectedCommodity.previous_price });
    }
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleValidation = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await handleValidation();
    if (isValid) {
      form.submit();
    }
  };

  return (
    <div className="justify-center items-center flex flex-col sm:flex-row py-3 h-full">
      <div>
        {" "}
        <Form
          form={form}
          variant="borderless"
          layout="vertical"
          size="large"
          requiredMark={false}
          name="comodity-form"
          onFinish={(values) => {
            mutate(values, {
              onSuccess: () => {
                form.resetFields();
              },
            });
          }}
          className="flex-col sm:flex-row w-[250px] lg:w-[1000px] md:w-full sm:w-full"
        >
          <div className="flex justify-end mb-2 mt-10">
            <Link
              to="/app/configuration/price-history"
              className="text-[16px] mb-10 font-semibold leading-24 text-[#658127] hover:text-[#b5ca88]"
            >
              Price history
            </Link>
          </div>
          <div
            className="gap-6 grid sm:grid-cols-1 md:grid-cols-2"
            style={{ marginBottom: "-3rem", marginTop: "-2rem" }}
          >
            <Form.Item
              name="commodity"
              label="Commodity"
              rules={[{ required: true, message: "Please select a commodity" }]}
            >
              <Select
                className="w-full"
                value={formData?.commodity || ""}
                onChange={(value) => handleSelectChange("commodity", value)}
                style={{
                  backgroundColor: "#EBE9E9",
                  marginTop: "-2rem",
                  borderRadius: 0,
                }}
              >
                {publicCommodities?.map((commodity, index) => (
                  <Select.Option key={commodity?._id} value={commodity?._id}>
                    {commodity?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="previous_price"
              label="Previous Price"
              rules={[
                { required: true, message: "Please enter the previous price" },
              ]}
            >
              <Input
                className=" w-full"
                name="previous_price"
                // onChange={handleInputChange}
                style={{
                  backgroundColor: "#EBE9E9",
                  marginTop: "-2rem",
                  borderRadius: 0,
                }}
              />
            </Form.Item>

            <Form.Item
              name="new_price"
              label="New Price"
              rules={[
                { required: true, message: "Please enter the new price" },
              ]}
            >
              <Input
                className=" w-full"
                name="new_price"
                onChange={handleInputChange}
                style={{
                  backgroundColor: "#EBE9E9",
                  marginTop: "-2rem",
                  borderRadius: 0,
                }}
              />
            </Form.Item>

            <Form.Item
              name="effective_date"
              label="Effective Date"
              rules={[
                { required: true, message: "Please select the effective date" },
              ]}
            >
              <Input
                type="date"
                onChange={handleInputChange}
                className=" w-full"
                style={{
                  backgroundColor: "#EBE9E9",
                  marginTop: "-2rem",
                  borderRadius: 0,
                }}
              />
            </Form.Item>

            <Form.Item
              name="effective_time"
              label="Effective Time"
              rules={[
                { required: true, message: "Please select the effective time" },
              ]}
            >
              <Input
                type="time"
                onChange={handleInputChange}
                className=" w-full"
                style={{
                  backgroundColor: "#EBE9E9",
                  marginTop: "-2rem",
                  borderRadius: 0,
                }}
              />
            </Form.Item>

            <Form.Item
              name="reason_for_change"
              label="Reason for change"
              rules={[
                {
                  required: true,
                  message: "Please enter the reason for change",
                },
              ]}
            >
              <Input.TextArea
                className=" w-full"
                name="reason_for_change"
                onChange={handleInputChange}
                rows={4}
                style={{
                  backgroundColor: "#EBE9E9",
                  marginTop: "-1rem",
                  borderRadius: 0,
                }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-end py-20 ">
            <Form.Item>
              <Button
                name="submit"
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
                className=" w-30 ml-6 rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
                style={{
                  background:
                    "linear-gradient(89.46deg, #39462D 13.05%, #658127 107.23%)",
                  color: "white",
                }}
                loading={isLoading > 0}
              >
                Submit{" "}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Price;

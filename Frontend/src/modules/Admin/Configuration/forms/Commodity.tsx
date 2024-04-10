import React, { useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { useAddCommodity } from "../../hooks";
import { Link } from "react-router-dom";
import { InboxOutlined } from "@ant-design/icons";
import { queryKeys } from "../../../../react-query/constants";
import TextArea from "antd/es/input/TextArea";

interface FormData {
  commodity: string;
  current_price: string;
  previous_price: string;
  analysis: string;
  image: any;
}

const Commodity = () => {
  const { mutate } = useAddCommodity();
  const isLoading = useIsMutating();
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [files, setFiles] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    commodity: "",
    current_price: "",
    previous_price: "",
    image: "",
    analysis: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (info: any) => {
    const file = info.file;
    setFiles(file);
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    }
  };

  const props = {
    name: "file",
    multiple: false,
    beforeUpload: () => false,
    fileList: [],
    onChange: handleFileChange,
  };

  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const data = new FormData();
      data.append("name", formData.commodity);
      data.append("analysis", formData.analysis);
      data.append("current_price", formData.current_price);
      data.append("previous_price", formData.current_price);
      data.append("image", files as any);
      mutate(data as any, {
        onSuccess: () => {
          form.resetFields();
          queryClient.invalidateQueries([queryKeys.commodity]);
          setPreviewImage(null);
          setFiles(null);
        },
      });
    } catch (error) {
      // console.error("Validation failed:", error);
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
          name="commodity-form"
          className="flex-col sm:flex-row w-[250px] lg:w-[1000px] md:w-full sm:w-full"
        >
          <div className="flex justify-end mb-2 mt-10">
            <Link
              to="/app/configuration/commodity"
              className="text-[16px] mb-10 font-semibold leading-24 text-[#658127] hover:text-[#b5ca88]"
            >
              View Commodities
            </Link>
          </div>
          <div
            className="gap-6 flex flex-col sm:flex-row"
            style={{ marginBottom: "-3rem", marginTop: "-2rem" }}
          >
            <div className="flex-col" style={{ flex: 1 }}>
              <Form.Item
                name="commodity"
                label="Commodity Name"
                rules={[
                  { required: true, message: "Please enter a commodity name" },
                ]}
              >
                <Input
                  className="w-full"
                  name="commodity"
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: "#EBE9E9",
                    marginTop: "-2rem",
                    borderRadius: 0,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="current_price"
                label="Price"
                rules={[
                  { required: true, message: "Please enter the current price" },
                ]}
              >
                <Input
                  className=" w-full"
                  name="current_price"
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: "#EBE9E9",
                    marginTop: "-2rem",
                    borderRadius: 0,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="analysis"
                label="Analysis"
                rules={[
                  { required: true, message: "Please enter an analysis" },
                ]}
              >
                <TextArea
                  className=" w-full"
                  name="analysis"
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: "#EBE9E9",
                    marginTop: "-1rem",
                    borderRadius: 0,
                  }}
                  rows={4}
                />
              </Form.Item>
            </div>

            <div className="flex-col" style={{ flex: 1 }}>
              <Form.Item
                name="image"
                label="Image"
                rules={[{ required: true, message: "Please upload an image" }]}
              >
                <Upload.Dragger {...props}>
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ width: "50%", height: "150%" }}
                    />
                  ) : (
                    <>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited
                        from uploading company data or other banned files.
                      </p>
                    </>
                  )}
                </Upload.Dragger>
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end py-20 ">
            <Form.Item>
              <Button
                name="submit"
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
                className="w-30 ml-6 rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
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

export default Commodity;

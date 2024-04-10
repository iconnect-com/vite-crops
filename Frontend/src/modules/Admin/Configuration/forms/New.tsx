import React, { useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { useIsMutating } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { InboxOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAddNews } from "../../hooks";

interface FormData {
  title: string;
  description: string;
  image: any;
}

const News = () => {
  const { mutate } = useAddNews();
  const isLoading = useIsMutating();
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [files, setFiles] = useState<string | null>(null);
  const [values, setValues] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    image: "",
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

  const handleQuillChange = (content: string) => {
    setFormData({ ...formData, description: content });
    setValues(content);
  };

  const props = {
    name: "file",
    multiple: false,
    beforeUpload: () => false,
    fileList: [],
    onChange: handleFileChange,
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", values);
      data.append("image", files as any);
      mutate(data as any, {
        onSuccess: () => {
          form.resetFields();
          setPreviewImage(null);
          setFiles(null);
        },
      });
    } catch (error) {}
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
          name="news-form"
          className="flex-col sm:flex-row w-[250px] lg:w-[1000px] md:w-full sm:w-full"
        >
          <div className="flex justify-end mb-2 mt-10">
            <Link
              to="/app/configuration/market-news"
              className="text-[16px] mb-10 font-semibold leading-24 text-[#658127] hover:text-[#b5ca88]"
            >
              View News
            </Link>
          </div>
          <div
            className="gap-6 flex flex-col sm:flex-row"
            style={{ marginBottom: "-3rem", marginTop: "-2rem" }}
          >
            <div className="flex-col" style={{ flex: 1 }}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input
                  className="w-full"
                  name="title"
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: "#EBE9E9",
                    marginTop: "-2rem",
                    borderRadius: 0,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description" },
                ]}
              >
                <ReactQuill
                  className=" w-full h-[140px]"
                  theme="snow"
                  value={values}
                  onChange={handleQuillChange}
                  style={{
                    backgroundColor: "#EBE9E9",
                    marginTop: "-1rem",
                    borderRadius: 0,
                  }}
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
                      style={{ width: "250%", height: "250px" }}
                    />
                  ) : (
                    <>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="text-sm px-10">
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
                type="text"
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

export default News;

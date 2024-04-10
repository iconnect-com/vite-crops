/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { useIsMutating } from "@tanstack/react-query";
import { InboxOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useUpdateNews } from "../../../hooks";
import { decode } from "html-entities";
import { useParams } from "react-router-dom";

interface FormData {
  title: string;
  description: string;
  image: any;
}

interface NewsRecord {
  _id: string;
  title: string;
  description: string;
  image: string;
  data: any[];
}

interface EditNewsFormProps {
  data: NewsRecord;
  id: string;
  innerHTML: any[];
}

const EditNewsForm = ({ data }: EditNewsFormProps) => {
  const isLoading = useIsMutating();
  const { id } = useParams();

  const decodedHtml = decode(data?.description || "");

  const { mutate } = useUpdateNews(id as any);
  const [form] = Form.useForm();
  const [files, setFiles] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(data.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [values, setValues] = useState(decodedHtml);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  // Calling the Quill editor to Convert HTML to Delta
  const quillRef = useRef<ReactQuill>(null);
  useEffect(() => {
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();
      const delta = quillInstance.clipboard.convert(decodedHtml);
      quillInstance.setContents(delta);
    }
  }, [decodedHtml]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.getFieldValue("title"));
    data.append("description", form.getFieldValue("description"));
    if (imageFile) {
      data.append("image", imageFile);
    }
    mutate(data as any, {
      onSuccess: () => {
        form.resetFields();
        setPreviewImage(null);
        setImageFile(null);
      },
    });
  };

  return (
    <div className="justify-center items-center flex flex-col sm:flex-row py-3 h-full">
      <div>
        <Form
          form={form}
          variant="borderless"
          layout="vertical"
          requiredMark={false}
          size="large"
          name="commodity-form"
          className="flex-col sm:flex-row w-[250px] lg:w-[1000px] md:w-full sm:w-full"
        >
          <div className="flex justify-end mb-2 mt-10"></div>
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
                  ref={quillRef}
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

export default EditNewsForm;

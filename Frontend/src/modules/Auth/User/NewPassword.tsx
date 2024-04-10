import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useChangePassword } from "../../../hooks/auth";
import nirsal from "../../../assets/download.jpeg";
import { useIsMutating } from "@tanstack/react-query";
import { AuthWrapper } from "./components/AuthWrapper";
import { Link, useNavigate, useParams } from "react-router-dom";

interface FormData {
  // currentPassword: string;
  password: string;
}
const NewPassword = () => {
  const { token } = useParams();
  const { mutate } = useChangePassword(token);

  const isLoading = useIsMutating();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [formData, setFormData] = useState<FormData>({
    password: "",
    // newPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      await form.submit();
      navigate("/login");
    }
  };

  return (
    <>
      <AuthWrapper>
        <div className="flex items-center justify-center w-[450px]">
          <Form
            name="forgot-password"
            initialValues={{ remember: true }}
            onFinish={(values) => {
              mutate(values, {
                onSuccess: () => {
                  form.resetFields();
                },
              });
            }}
            className="bg-white p-10 sm:shadow-md w-full"
            form={form}
            variant="borderless"
            layout="vertical"
          >
            <div className="">
              <Link to="/">
                <img className="h-12 w-17" src={nirsal} alt="ChitChat Logo" />
              </Link>{" "}
            </div>

            <div className="text-2xl mt-8 mb-1 font-bold text-black">
              New Password{" "}
            </div>
            <div className="text-sm mb-5 font-medium text-black">
              Kindly use a combination unique to you
            </div>

            {/* <Form.Item
              name="currentPassword"
              label="Password"
              rules={[{ required: true, message: "Please input a password!" }]}
            >
              <Input.Password
                className="border-gray-300 rounded-none"
                name="currentPassword"
                onChange={handleInputChange}
                style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
              />
            </Form.Item> */}

            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: "Please input a new password!" },
              ]}
            >
              <Input.Password
                className="border-gray-300 rounded-none"
                name="password"
                onChange={handleInputChange}
                style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
              />
            </Form.Item>

            <div className="flex justify-end items-center mt-4">
              <div className="flex flex-row mb-8"></div>

              <Form.Item>
                <Button
                  onClick={handleSubmit}
                  name="email"
                  type="primary"
                  htmlType="submit"
                  className="w-40 mb-10 h-10 rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
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
      </AuthWrapper>
    </>
  );
};

export default NewPassword;

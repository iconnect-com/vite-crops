import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useForgotPassword } from "../../../hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import nirsal from "../../../assets/download.jpeg";
import googleIcon from "../../../assets/logo_google.png";
import { useIsMutating } from "@tanstack/react-query";
import { AuthWrapper } from "./components/AuthWrapper";
// import { GoogleLogin } from 'react-google-login';

interface FormData {
  email: string;
}
const ResetPassword = () => {
  const { mutate } = useForgotPassword();
  const isLoading = useIsMutating();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
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
      form.submit();
      navigate("/");
    }
  };

  return (
    <>
      <AuthWrapper>
        <div className="flex items-center justify-center w-[400px]">
          <Form
            name="reset-password"
            onFinish={(values) => {
              mutate(values, {
                onSuccess: () => {
                  form.resetFields();
                },
              });
            }}
            className="bg-white p-7 sm:shadow-md w-full"
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
              Reset Password{" "}
            </div>
            <div className="text-sm mb-5 font-medium text-black">
              Kindly input your email, let's get you back on track
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                className="border-gray-300 rounded-none"
                name="email"
                onChange={handleInputChange}
                style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
              />
            </Form.Item>

            <div className="flex justify-end items-center mt-4">

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

export default ResetPassword;

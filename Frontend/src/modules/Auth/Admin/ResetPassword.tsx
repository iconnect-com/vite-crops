import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { useForgotPassword } from "../../../hooks/auth";
import nirsal from "../../../assets/download.jpeg";
import { useIsMutating } from "@tanstack/react-query";
import { AuthWrapperAdmin } from "./components/AuthWrapperAdmin";
// import { GoogleLogin } from 'react-google-login';

interface FormData {
  email: string;
}
const ResetPassword = () => {
  const { mutate, isSuccess, reset } = useForgotPassword();
  const isLoading = useIsMutating();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [form] = Form.useForm();

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
    <AuthWrapperAdmin>
      <div className="flex-1 flex items-center justify-center">
        <Form
          name="Rest Password"
          onFinish={(values) => {
            mutate(values, {
              onSuccess: () => {
                form.resetFields();
              },
            });
          }}
          className="flex-col bg-white p-10 w-full ml-5 mr-5 sm:ml-20 sm:mr-20"
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
          <div className="text-sm mb-10 font-medium text-black">
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

          <Button
            onClick={handleSubmit}
            type="primary"
            htmlType="submit"
            className="w-full h-10 rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
            style={{
              background:
                "linear-gradient(89.46deg, #39462D 13.05%, #658127 107.23%)",
              color: "white",
            }}
            loading={isLoading > 0}
          >
            Submit{" "}
          </Button>
        </Form>
      </div>
    </AuthWrapperAdmin>
  );
};

export default ResetPassword;

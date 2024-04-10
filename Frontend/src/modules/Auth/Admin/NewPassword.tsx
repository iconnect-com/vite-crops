import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useChangePassword } from "../../../hooks/auth";
import nirsal from "../../../assets/download.jpeg";
import { useIsMutating } from "@tanstack/react-query";
import { AuthWrapperAdmin } from "./components/AuthWrapperAdmin";
import { Link, useNavigate, useParams } from "react-router-dom";

interface FormData {
  // currentPassword: string;
  password: string;
}

const NewPassword = () => {
  const { id } = useParams();
  const { mutate } = useChangePassword(id);
  const isLoading = useIsMutating();
  const [form] = Form.useForm();
  const navigate = useNavigate();

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
      form.submit();
    }
  };

  return (
    <>
      <AuthWrapperAdmin>
        <div className="flex-1 flex items-center justify-center">
          <Form
            name="login"
            onFinish={(values) => {
              mutate(values, {
                onSuccess: () => {
                  form.resetFields();
                  navigate("/login");
                },
              });
            }}
            className="bg-white p-10 w-full ml-5 mr-5 sm:ml-20 sm:mr-20"
            form={form}
            variant="borderless"
            layout="vertical"
            size="large"
          >
            <div className="">
              <div className="">
                <Link to="/">
                  <img className="h-12 w-17" src={nirsal} alt="ChitChat Logo" />
                </Link>{" "}
              </div>{" "}
            </div>

            <div className="text-2xl mt-8 mb-1 font-bold text-black">
              New Password{" "}
            </div>
            <div className="text-sm mb-10 font-medium text-black">
              Kindly use a combination unique to you
            </div>

            <Form.Item
              name="password"
              label="New Password"
              rules={[{ required: true, message: "Please input a password!" }]}
            >
              <Input.Password
                className="border-gray-300 rounded-none"
                name="password"
                onChange={handleInputChange}
                style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
              />
            </Form.Item>

            {/* <Form.Item
              name="newPassword"
              label="Confirm Password"
              rules={[
                { required: true, message: "Please repeat the password!" },
              ]}
            >
              <Input.Password
                className="border-gray-300 rounded-none"
                name="newPassword"
                onChange={handleInputChange}
                style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
              />
            </Form.Item> */}

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
    </>
  );
};

export default NewPassword;

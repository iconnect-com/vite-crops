import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useRegister } from "../../../hooks/auth";
import nirsal from "../../../assets/download.jpeg";
import { useIsMutating } from "@tanstack/react-query";
import { AuthWrapper } from "./components/AuthWrapper";
import { Link } from "react-router-dom";

interface FormData {
  password: string;
  confirmPassword: string;
  fullname: string;
  email: string;
}

const Registration = () => {
  const { mutate } = useRegister();
  const isLoading = useIsMutating();
  const [form] = Form.useForm();

  const onFinish = (values: FormData) => {
    mutate(values as any);
  };

  return (
    <>
      <AuthWrapper>
        <div className="flex items-center justify-center w-[750px]">
          <Form
            name="register"
            onFinish={onFinish}
            className="bg-white p-7 sm:shadow-md w-full"
            form={form}
            layout="vertical"
          >
            <div className="">
              <Link to="/">
                <img className="h-12 w-17" src={nirsal} alt="ChitChat Logo" />
              </Link>{" "}
            </div>

            <div className="text-2xl mt-8 mb-1 font-bold text-black">
              Sign up{" "}
            </div>
            <div className="text-sm mb-5 font-medium text-black">
              This won’t take long{" "}
            </div>

            <div className="justify-center items-center mt-4 grid md:grid-cols-2 grid-cols-1 gap-4 w-full">
              <Form.Item
                name="fullname"
                label="Fullname"
                rules={[{ required: true, message: "Please input a name!" }]}
              >
                <Input className="border-gray-300 rounded-none w-full bg-[#EBE9E9]" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input a valid email!" },
                  {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please input a valid email!",
                  },
                ]}
              >
                <Input
                  className="border-gray-300 rounded-none w-full bg-[#EBE9E9]"
                  name="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input a password!" },
                ]}
              >
                <Input.Password
                  className="border-gray-300 rounded-none w-full bg-[#EBE9E9]"
                  name="password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[
                  {
                    required: true,
                    message: "Please input same password again!",
                  },
                  {
                    validator(rule, value, callback) {
                      return new Promise((resolve, reject) => {
                        if (value === form.getFieldValue("password")) {
                          resolve("");
                        } else {
                          reject("Passwords must match");
                        }
                      });
                    },
                  },
                ]}
              >
                <Input.Password
                  className="border-gray-300 rounded-none w-full bg-[#EBE9E9]"
                  name="confirmPassword"
                />
              </Form.Item>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-row mb-8">
                <span className="mb-5 text-sm text-gray-500">
                  Already have an account?{" "}
                </span>
                <a
                  href="/login"
                  className="ml-1 mr-1 text-green-900 text-sm font-bold hover:text-black"
                >
                  Log in{" "}
                </a>
              </div>

              <Button
                name="email"
                type="primary"
                htmlType="submit"
                className="w-40 mb-5 h-10 rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
                style={{
                  background:
                    "linear-gradient(89.46deg, #39462D 13.05%, #658127 107.23%)",
                  color: "white",
                }}
                loading={Boolean(isLoading)}
              >
                Submit{" "}
              </Button>
            </div>
          </Form>
        </div>
      </AuthWrapper>
    </>
  );
};

export default Registration;

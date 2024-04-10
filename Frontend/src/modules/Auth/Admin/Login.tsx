import React from "react";
import { Form, Input, Button } from "antd";
import { useLogin } from "../../../hooks/auth";
import { Link } from "react-router-dom";
import nirsal from "../../../assets/download.jpeg";
import { useIsMutating } from "@tanstack/react-query";
import { AuthWrapperAdmin } from "./components/AuthWrapperAdmin";
// import { GoogleLogin } from 'react-google-login';

const Login = () => {
  const { mutate, isSuccess, reset } = useLogin();
  const isLoading = useIsMutating();
  const [form] = Form.useForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.submit();
  };

  return (
    <AuthWrapperAdmin>
      <div className="flex items-center justify-center w-[450px]">
        <Form
          name="Admin login"
          form={form}
          variant="borderless"
          layout="vertical"
          onFinish={mutate}
          className="bg-white p-10  w-full"
        >
          <div className="">
            <Link to="/">
              <img className="h-12 w-17" src={nirsal} alt="ChitChat Logo" />
            </Link>
          </div>

          <div className="text-2xl mt-8 mb-1 font-bold text-black">
            Welcome back!{" "}
          </div>
          <div className="text-sm mb-5 font-medium text-black">
            We missed you{" "}
          </div>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
            label="Email"
          >
            <Input
              className="border-gray-300 rounded-none"
              name="email"
              style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            label="Password"
          >
            <Input.Password
              className="border-gray-300 rounded-none"
              name="password"
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
            Login{" "}
          </Button>

          {/* <div className="mt-5 flex items-center mb-8">
            <div className="border-t border-gray-500 flex-grow mr-3"></div>
            <span className="text-sm text-gray-500">Or register with</span>
            <div className="border-t border-gray-500 flex-grow ml-3"></div>
          </div> */}

          <div className="border-l-gray-500 border-gray-400 flex gap-1 items-center">
            <Link
              to="/admin/reset-password"
              className="mt-10 text-green-900 text-sm font-bold hover:text-black"
            >
              Forget Password?{" "}
            </Link>
          </div>

          {/* <Link to="">
            <div className="w-full h-10 flex items-center justify-center shadow-sm border border-gray-200 rounded hover:bg-gray-200">
              <img src={googleIcon} alt="Google" className="h-6 w-6" />
              <span className="ml-2 text-black text-sm">Google</span>
            </div>
          </Link> */}
        </Form>
      </div>
    </AuthWrapperAdmin>
  );
};

export default Login;

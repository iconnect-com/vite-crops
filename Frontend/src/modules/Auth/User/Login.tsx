import React from "react";
import { Form, Input, Button } from "antd";
import { useLogin } from "../../../hooks/auth";
import { Link } from "react-router-dom";
import nirsal from "../../../assets/download.jpeg";
import { useIsMutating } from "@tanstack/react-query";
import { AuthWrapper } from "./components/AuthWrapper";

const Login = () => {
  const { mutate, isSuccess, reset } = useLogin();
  const isLoading = useIsMutating();
  const [form] = Form.useForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.submit();
  };

  return (
    <>
      <AuthWrapper>
        <div className="flex items-center justify-center w-[450px]">
          <Form
            name="login"
            onFinish={mutate}
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
              Hello There!
            </div>
            <div className="text-sm mb-8 font-medium text-black">
              It’s great seeing you again
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
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              label="Password"
            >
              <Input.Password
                className="border-gray-300 rounded-none"
                name="password"
                style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
              />
            </Form.Item>
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                type="primary"
                htmlType="submit"
                className="w-40 h-10 rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
                style={{
                  background:
                    "linear-gradient(89.46deg, #39462D 13.05%, #658127 107.23%)",
                  color: "white",
                }}
                loading={isLoading > 0}
              >
                Log in
              </Button>
            </div>

            <div className="mt-5 flex flex-col gap-1 mb-8 items-center">
              <Link
                to="/reset-password"
                className="text-sm text-gray-500 whitespace-nowrap"
              >
                Forgot password?
              </Link>
              <div className="border-l-gray-500 border-gray-400 flex gap-1 items-center">
                {" "}
                <span className="text-sm text-gray-500">
                  Don't have an account yet?{" "}
                </span>
                <Link
                  to="/create-account"
                  className=" text-green-900 text-sm font-bold hover:text-black"
                >
                  Sign up
                </Link>
              </div>
            </div>

            {/* <GoogleLogin
            clientId="yourClientId"
            buttonText="Log in with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            /> */}

            {/* <Link to="">
              <div className="w-full h-10 flex items-center justify-center shadow-sm border border-gray-200 rounded hover:bg-gray-200">
                <img src={googleIcon} alt="Google" className="h-6 w-6" />
                <span className="ml-2 text-black text-sm">
                  Log in with Google
                </span>
              </div>
            </Link> */}
          </Form>
        </div>
      </AuthWrapper>
    </>
  );
};

export default Login;

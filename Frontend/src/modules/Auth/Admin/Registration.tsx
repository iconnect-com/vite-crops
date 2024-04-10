import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useLogin } from "../../../hooks/auth";
import { Link } from "react-router-dom";
import bg1 from "../../../assets/Frame-1.png";
import bg2 from "../../../assets/Frame-2.png";
import nirsal from "../../../assets/download.jpeg";
import googleIcon from "../../../assets/logo_google.png";
import { useIsMutating } from "@tanstack/react-query";
import { AuthWrapperAdmin } from "./components/AuthWrapperAdmin";
// import { GoogleLogin } from 'react-google-login';

interface FormData {
  password: string;
  confirmPassword: string;
  fullname: string;
  email: string;
}
const AdminReg = () => {
  const { mutate } = useLogin();
  const isLoading = useIsMutating();

  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [bg1, bg2];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
    }, 1500);

    return () => clearInterval(intervalId);
    // eslint-dis5able-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //   mutate(formData);
  };

  const onFinish = (values: FormData) => {};

  return (
    <AuthWrapperAdmin>
      <div className="flex-1 flex items-center justify-center">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="bg-white p-10 w-full ml-5 mr-5 sm:ml-20 sm:mr-20"
        >
          <div className="">
            <Link to="/">
              <img className="h-12 w-17" src={nirsal} alt="ChitChat Logo" />
            </Link>{" "}
          </div>

          <div className="text-2xl mt-8 mb-1 font-bold text-black">
            Let’s get you started{" "}
          </div>
          <div className="text-sm mb-5 font-medium text-black">
            This won’t take long{" "}
          </div>

          <div className="text-md font-medium text-black">Full name</div>

          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              className="border-gray-300 rounded-none"
              name="fullname"
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
            label="Email"
          >
            <Input
              className="border-gray-300 rounded-none"
              name="email"
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            label="Password"
          >
            <Input.Password
              className="border-gray-300 rounded-none"
              onChange={handleInputChange}
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
            Create Account{" "}
          </Button>

          {/* <div className="mt-5 flex items-center mb-8">
            <div className="border-t border-gray-500 flex-grow mr-3"></div>
            <span className="text-sm text-gray-500">Or register with</span>
            <div className="border-t border-gray-500 flex-grow ml-3"></div>
          </div> */}

          <div className="border-l-gray-500 border-gray-400 flex gap-1 items-center">
            {" "}
            <span className="text-sm text-gray-500">
              Already have an account?{" "}
            </span>
            <Link
              to="/a/create-account"
              className=" text-green-900 text-sm font-bold hover:text-black"
            >
              Login{" "}
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

export default AdminReg;

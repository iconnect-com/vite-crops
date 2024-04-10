import React from "react";
import LayoutSAdmin from "../../layout/Super Admins";
import Pics from "../../assets/mingcute_time-line.png";
import { useIsMutating } from "@tanstack/react-query";
import { Form, Input, Button } from "antd";
import { useRegisterAdmin } from "../../hooks/auth";

const Dashboard = () => {
  const { mutate } = useRegisterAdmin();
  const isLoading = useIsMutating();
  const [form] = Form.useForm();

  return (
    <LayoutSAdmin Heading="Add an Admin" Background={Pics}>
      <div className="min-h-[250px] flex items-center justify-center">
        <div className="flex items-center justify-center w-[750px]">
          <Form
            name="register"
            onFinish={mutate}
            className="bg-white w-full p-7 sm:p-20"
            form={form}
            layout="vertical"
          >
            <Form.Item name="fullname" label="Fullname">
              <Input className="border-gray-300 rounded-none w-full bg-[#EBE9E9]" />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input
                className="border-gray-300 rounded-none w-full bg-[#EBE9E9]"
                name="email"
              />
            </Form.Item>

            <div className="items-center justify-center">
              <Button
                name="email"
                type="primary"
                htmlType="submit"
                className="w-40 mb-5 h-10 rounded justify-center bg-blue-500 hover:text-black hover:bg-white text-sm"
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
      </div>
    </LayoutSAdmin>
  );
};

export default Dashboard;

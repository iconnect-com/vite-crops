import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
import Layouts from "../../../layout/Users";
import backs from "../../assets/large-rice-filed.jpg";
import { useIsMutating } from "@tanstack/react-query";
import { useGetMe, useUpdateMe } from "../../../hooks/auth";
import { successAlert } from "../../../utils";
import dayjs from "dayjs";
import ProfileCards from "./components/ProfileCards";
import AdminLayout from "../../../layout/Admins";

interface FormData {
  fullname: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
}

const Profile = () => {
  const { mutate, isSuccess, reset } = useUpdateMe();
  const isLoading = useIsMutating();

  const [form] = Form.useForm();
  const data = useGetMe();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      const formattedData = {
        ...data,
        date_of_birth: dayjs(data.date_of_birth).format("YYYY-MM-DD"),
      };
      form.setFieldsValue(formattedData);
    }
  }, [data, form]);

  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    date_of_birth: "",
    address: "",
    phone: "",
    gender: "",
  });

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 15);

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 15);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.submit();
  };

  if (isSuccess) {
    reset();
    successAlert("Profile updated successfully");
  }

  return (
    <AdminLayout pageTitle="Profile">
      <div className="max-sm:w-full flex flex-col sm:flex-row py-3 h-full flex-wrap">
        {/* <div className="max-sm:w-full flex flex-col sm:flex-row py-3 h-full"> */}
        <div>
          {" "}
          <ProfileCards />
        </div>
        <div className="ml-0 sm:ml-10">
          {" "}
          <Form
            form={form}
            variant="borderless"
            layout="vertical"
            size="large"
            name="profile-form"
            onFinish={mutate}
            className="px-4 w-[350px] sm:w-[700px]"
          >
            <div className="text-2xl mb-8 sm:mt-0 mt-4 font-bold text-black">
              Basic Information
            </div>
            <div
              className="gap-6 grid sm:grid-cols-1 md:grid-cols-2 w-full"
              style={{ marginBottom: "-3rem", marginTop: "-2rem" }}
            >
              <div className="">
                <Form.Item name="fullname" label="Fullname">
                  <Input
                    value={formData?.fullname || ""}
                    className=" w-full"
                    readOnly
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  />
                </Form.Item>
              </div>

              <div className="">
                <Form.Item name="email" label="Email">
                  <Input
                    value={formData?.email || ""}
                    className=" w-full"
                    name="email"
                    readOnly
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  />
                </Form.Item>
              </div>

              <div className="">
                <Form.Item name="phone" label="Phone Number">
                  <Input
                    value={formData?.phone || ""}
                    className=" w-full"
                    name="phone"
                    onChange={handleInputChange}
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  />
                </Form.Item>
              </div>

              <div className="">
                <Form.Item name="address" label="Address">
                  <Input
                    value={formData?.address || ""}
                    className=" w-full"
                    name="address"
                    onChange={handleInputChange}
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  />
                </Form.Item>
              </div>

              <div className="">
                <Form.Item name="date_of_birth" label="Date of Birth">
                  <Input
                    type="date"
                    onChange={handleInputChange}
                    className=" w-full"
                    max={maxDate.toISOString().split("T")[0]}
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  />
                </Form.Item>
              </div>

              <div className="">
                <Form.Item name="gender" label="Gender">
                  <Select
                    className=" w-full"
                    value={formData?.gender || ""}
                    onChange={(value) => handleSelectChange("gender", value)}
                    style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
                  >
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>

      <div className="py-10">
        <Button
          name="submit"
          onClick={handleSubmit}
          type="primary"
          htmlType="submit"
          className="w-30 ml-4 rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
          style={{
            background:
              "linear-gradient(89.46deg, #39462D 13.05%, #658127 107.23%)",
            color: "white",
          }}
          loading={isLoading > 0}
        >
          Update Profile{" "}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default Profile;

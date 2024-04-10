// ConfigurationPage component
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Button, TabsProps } from "antd";
import Price from "../forms/price";
import News from "../forms/New";
import Commodity from "../forms/Commodity";

const ConfigurationPage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <div className=" ml-5 w-full flex-row">
          <span>Pricing</span>
        </div>
      ),
      children: (
        <div className="bg-[#FFFFFF] w-full flex-row">
          <Price />
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className=" w-full flex-row">
          <span>News</span>
        </div>
      ),

      children: (
        <div className="bg-[#FFFFFF] w-full flex-row">
          <News />
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className=" w-full flex-row">
          <span>Commodity</span>
        </div>
      ),
      children: (
        <div className="bg-[#FFFFFF] w-full flex-row">
          <Commodity />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button
        onClick={handleGoBack}
        type="text"
        className="w-30 h-10 mb-6"
        style={{
          background: "#65812729",
          color: "black",
          borderRadius: "50px",
          boxShadow: "none",
        }}
      >
        Back{" "}
      </Button>

      <>
        <div className=" w-full flex-row">
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </>
    </div>
  );
};

export default ConfigurationPage;

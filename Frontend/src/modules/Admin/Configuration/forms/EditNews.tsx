import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../../../../layout/Admins";
import "react-quill/dist/quill.snow.css";
import { Button } from "antd";
import EditNewsForm from "./components/EditNewForm";

const EditNews = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const location = useLocation();
  const data = location.state;
  const NewsRecord = data.record;

  return (
    <AdminLayout pageTitle="Configuration">
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

        <div className="bg-[#FFFFFF] w-full flex-row">
          <EditNewsForm data={NewsRecord} id={""} innerHTML={[]} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditNews;

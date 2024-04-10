import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex justify-center items-center mt-20">
      <Result
        status="404"
        title="Not Authorized4"
        subTitle="Sorry, You're not authorized to access this route."
        extra={
          <Button onClick={handleGoBack} type="dashed">
            Go Back{" "}
          </Button>
        }
      />
    </div>
  );
};

export default NotAuthorized;

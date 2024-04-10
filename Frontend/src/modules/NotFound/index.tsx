import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <Result 
        status="404"
        title="Page Not Found"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button onClick={handleGoBack} type="text">
            Go back{" "}
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;

import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../context";
import { useGetMe, useUploadProfile } from "../../../hooks/auth";
import swal from "sweetalert";
import { Card, Popover } from "antd";
import picture from "../../../assets/Avatar.svg";

const ProfileCards = () => {
  const { user } = useContext(AuthContext);
  const data = useGetMe();

  useEffect(() => {
    if (data?.photo) {
      const newPicture = data?.photo;
      setPreviewImage(newPicture);
    }
  }, [data?.photo]);

  const fileInput = useRef(null);
  const id = user?._id as string;
  const { uploadProfilePromise } = useUploadProfile(id);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const { mutate } = useGetMe();

  const handleAvatarClick = () => {
    if (fileInput.current) {
      (fileInput.current as HTMLInputElement).click();
    }
  };

  const addFile = async (file: any) => {
    if (!file) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      swal("File is too large (maximum size is 5MB)");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await uploadProfilePromise(formData);
      mutate();
    } catch (error) {
    } finally {
    }
  };

  const content = (
    <div className="flex-col justify-center items-center">
      {/* <CameraOutlined /> */}
      <p>Click to upload an image</p>
    </div>
  );

  return (
    <>
      <input
        type="file"
        ref={fileInput}
        style={{ display: "none" }}
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          if (selectedFile) {
            addFile(selectedFile);
          }
        }}
      />
      {previewImage ? (
        <Popover placement="top" content={content} title="Upload">
          <Card
            hoverable
            style={{
              width: "350px",
              height: "350px",
              border: "none",
              marginBottom: "20px",
              boxShadow: "none",
              overflow: "hidden",
            }}
            onClick={handleAvatarClick}
            cover={
              <img
                alt="User"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                src={previewImage}
              />
            }
          ></Card>
        </Popover>
      ) : (
        <Card
          hoverable
          style={{
            width: "350px",
            height: "250px",
            border: "none",
            marginBottom: "20px",
            boxShadow: "none",
            overflow: "hidden",
          }}
          onClick={handleAvatarClick}
          cover={
            <img
              alt="example"
              style={{
                maxHeight: "100%",
                width: "auto",
                objectFit: "cover",
              }}
              src={picture}
            />
          }
        ></Card>
      )}
    </>
  );
};

export default ProfileCards;

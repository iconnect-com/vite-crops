import React, { useContext, useEffect } from "react";
import man from "../../assets/Ellipse 929.png";
import { AuthContext } from "../../../context";
import { useGetMe } from "../../../hooks/auth";
import picture from "../../../assets/Avatar.svg";

interface NavbarProps {
  pageTitle: string;
}

const Header: React.FC<NavbarProps> = ({ pageTitle }) => {
  const data = useGetMe();

  useEffect(() => {
    if (data?.photo) {
      const newPicture = data?.photo;
      setPreviewImage(newPicture);
    }
  }, [data?.photo]);

  const { user } = useContext(AuthContext);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">{pageTitle}</h3>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-4 bg-white rounded-full p-2">
            <img
              src={previewImage || picture}
              alt="man"
              className="w-10 h-10 rounded-full"
            />
            <div className="">
              <h4 className="text-sm font-medium leading-none mb-2">
                {user?.fullname}{" "}
              </h4>
              <p className="text-[10px] font-medium mt-1 leading-none">
                {user?.role}
              </p>
            </div>
            <div className="h-2 w-2 flex items-center justify-center rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-lg font-bold">
        Welcome Back, {user?.fullname}{" "}
      </div>
      <div className="text-sm">
        {" "}
        It's great seeing you again, do have a nice day
      </div>
    </div>
  );
};

export default Header;

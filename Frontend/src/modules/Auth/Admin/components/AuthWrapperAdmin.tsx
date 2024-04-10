import React, { ReactNode, useEffect, useState } from "react";
import bg1 from "../../../../assets/Frame-1.png";
import bg2 from "../../../../assets/Frame-2.png";

type Props = {
  children: ReactNode;
};

export const AuthWrapperAdmin = ({ children }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [bg1, bg2];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
    }, 30000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex]);

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 560);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen flex">
      {children}
      {isLargeScreen && (
        <div className="flex-1 relative hidden md:block">
          <img
            src={images[currentImageIndex]}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

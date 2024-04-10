import React, { ReactNode, useEffect, useState } from "react";
import bg1 from "../../../../assets/country-side.jpg";
import bg2 from "../../../../assets/harvesting-wheat.jpg";
import bg3 from "../../../../assets/sunset-rural-farm.jpg";

type Props = {
  children: ReactNode;
};

export const AuthWrapper = ({ children }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [bg1, bg2, bg3];
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
    }, 30000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={
        isSmallScreen
          ? {}
          : { backgroundImage: `url(${images[currentImageIndex]})` }
      }
    >
      {children}
    </div>
  );
};

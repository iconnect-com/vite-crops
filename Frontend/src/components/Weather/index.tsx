import React, { useEffect, useState } from "react";
import { Avatar } from "antd";
import WeatherBg from "../../assets/captured-raindrops.jpg";
import { useGetWeatherData } from "../../modules/Admin/hooks";

interface Forecast {
  id: number | null | undefined;
  temperature: number;
  condition: string;
  day: string;
}

interface WeatherProps {
  forecasts: Forecast[];
}

const Weather: React.FC<WeatherProps> = ({ forecasts }) => {
  const [position, setPosition] = useState({
    lat: 9.0570752,
    long: 7.4514432,
  });

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position?.coords?.latitude || 9.0570752,
          long: position?.coords?.longitude || 7.4514432,
        });
      },
      (err) => {}
    );
  }, []);

  const data = useGetWeatherData(position) as unknown as IWeather;

  return (
    <div
      className="w-full h-full p-6 box-border"
      style={{
        backgroundImage: `
    linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)),
    url(${WeatherBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="py-2 text-2xl text-white font-[600]">Weather Today</div>
      <div className="items-center flex-row p-0">
        <Avatar
          src={`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`}
        />
        <div className="text-[25px] font-[600] text-white">
          {data?.main?.temp}&deg;
          <span>C</span>
        </div>
        <div className="text-sm  mb-2 font-medium text-white capitalize ">
          {data?.weather?.[0]?.description}, {data?.name}
        </div>
      </div>
    </div>
  );
};

export default Weather;

interface IWeather {
  coord: Coord;
  weather?: WeatherEntity[] | null;
  base: string;
  main: Main;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  id: number;
  name: string;
  cod: number;
}
interface Coord {
  lon: number;
  lat: number;
}
interface WeatherEntity {
  id: number;
  main: string;
  description: string;
  icon: string;
}
interface Main {
  temp: number;
  pressure: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
}
interface Wind {
  speed: number;
  deg: number;
}
interface Clouds {
  all: number;
}
interface Sys {
  type: number;
  id: number;
  message: number;
  country: string;
  sunrise: number;
  sunset: number;
}

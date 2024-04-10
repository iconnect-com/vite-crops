import React, { useState, useEffect, useContext } from "react";
import commodityIcon from "../../../../assets/icon-park-outline_change.png";
import commodityIcon2 from "../../../../assets/ic_outline-pending.png";
import commodityIcon3 from "../../../../assets/ic_outline-pending.png";
import clock from "../../../../assets/mingcute_time-line.png";
import calendar from "../../../../assets/bx_calendar.png";
import weather from "../../../../assets/fluent_weather-haze-24-filled.png";
import { Card, Col, Row } from "antd";
import Calendars from "../../../../components/Calendar";
import { Link } from "react-router-dom";
import TableComponent from "./TableComponent";
import { useGetRegisteredUsers } from "../../../../hooks/auth";
import { DataContext } from "../../../../context/DataContext";
import { useGetConfiguration } from "../../hooks";

const DashboardPage = () => {
  const allUsers = useGetRegisteredUsers();
  const Users = allUsers?.totalUsers;
  const { publicCommodities } = useContext(DataContext);
  const { data: MarketPrices } = useGetConfiguration();
  const PendingPrices = MarketPrices?.filter(
    (item: any) => item?.status === "Pending"
  );
  const blocksData = [
    {
      title: "Total Manual Updated Commodity",
      value: publicCommodities?.length || 0,
      path: "/app/configuration/commodity",
    },
    {
      title: "Pending Price",
      text: "Update",
      value: PendingPrices?.length || 0,
    },
    {
      title: "No of Registered",
      text: "Users",
      value: Users?.length || 0,
      path: "/app/users",
    },
  ];
  const backgroundColorClasses = [
    "bg-[#31859F] border-solid border-4 border-[rgba(49, 133, 159, 0.31)]",
    "bg-[#E36C29] border-solid border-4 border-[rgba(227, 108, 41, 0.31)]",
    "bg-[#319F43] border-solid border-4 border-[rgba(227, 108, 41, 0.31)]",
  ];
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const icons = [commodityIcon, commodityIcon2, commodityIcon3];

  return (
    <>
      <div className="mt-9">
        <Row gutter={8} className="flex gap-8">
          <Col xs={24} sm={24} md={14} lg={14} className="lg:basis-[100%]">
            <Row gutter={24} className="gap-4 sm:gap-0">
              {blocksData.map((block, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={8}>
                  <Link to={(blocksData[index] as { path: string }).path}>
                    <Card className="bg-white rounded-md shadow-md gap-4">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-sm font-normal">
                            {block.title}
                          </div>
                          <div className="text-sm font-normal mt-1">
                            {block.text}
                          </div>
                          <div className="text-2xl font-bold mt-4">
                            {block.value}
                          </div>
                        </div>

                        <div
                          className={`flex items-center justify-center rounded-full  ${backgroundColorClasses[index]}`}
                        >
                          <img
                            className=""
                            src={icons[index]}
                            alt="commodity"
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
            <Row gutter={24} className="mt-8 gap-4 sm:gap-0">
              <Col xs={24} sm={24} md={24} lg={24}>
                <section className="bg-white rounded-md shadow-md p-4 lg:items-center justify-between flex flex-col md:flex-row lg:px-10">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-10 md:w-10 lg:w-10"
                      src={weather}
                      alt=""
                    />
                    <div>
                      <div className="text-sm lg:text-2xl font-semibold">
                        28&deg;
                      </div>
                      <div className="text-sm lg:text-md">
                        Feels like 35&deg;
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">|</div>

                  <div className="flex items-center gap-4">
                    <img
                      className="w-10 md:w-10 lg:w-10"
                      src={clock}
                      alt="clock"
                    />
                    <div className="text-sm lg:text-md">
                      {/* {currentTime.toLocaleTimeString()} */}
                      {currentTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="hidden font-bold h-full md:block">|</div>

                  <div className="flex items-center gap-4">
                    <img
                      className="w-10 md:w-10 lg:w-10"
                      src={calendar}
                      alt="Calendar"
                    />
                    <div className="text-sm lg:text-md">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </section>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={24} md={9} lg={9}>
            <Calendars />
          </Col>
        </Row>
        <TableComponent />
      </div>
    </>
  );
};

export default DashboardPage;

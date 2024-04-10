import React from "react";
import { Steps, Row, Col } from "antd";
import path1 from "../../assets/path1.png";
import path2 from "../../assets/path2.png";

interface DataType {
  data: any[];
}

const { Step } = Steps;

const Analysis: React.FC<DataType> = ({ data }) => {
  return (
    <div
      className="w-full h-full p-[15px] border-none box-border"
      style={{
        background: "rgba(248, 248, 248, 1)",
      }}
    >
      <div className="text-xl mb-0 mt-4 font-bold text-black">
        Top Crops Market Prices{" "}
      </div>
      <div className="text-sm mb-6 font-medium text-black">
        See prices for the top 5 products today{" "}
      </div>

      <Steps
        direction="vertical"
        size="small"
        current={1}
        className="custom-steps"
      >
        {data?.slice(0, 5).map((item, index) => {
          const priceDifference = item.current_price - item.previous_price;
          let sign = "";
          let color = "#319F43";

          if (priceDifference < 0) {
            sign = "-";
            color = "red";
          } else if (priceDifference > 0) {
            sign = "+";
            color = "green";
          }
          return (
            <Step
              className="justify-center items-center mt-0 mb-0"
              style={{
                marginTop: "0px",
                marginBottom: "0px",
              }}
              key={item._id}
              description={
                <Row
                  gutter={5}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                  }}
                >
                  <Col
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      marginLeft: ".2rem",
                    }}
                    xs={6}
                    sm={6}
                    md={4}
                    lg={6}
                  >{`${item.name}`}</Col>
                  <Col xs={4} sm={4} md={4} lg={4}>
                    <img
                      src={index % 2 === 0 ? path2 : path1}
                      alt="line"
                      style={{
                        filter: `hue-rotate(${getColor(index)}deg)`,
                      }}
                    />{" "}
                  </Col>
                  <Col xs={6} sm={6} md={6} lg={4}>
                    <span
                      style={{
                        backgroundColor: getColor(index),
                        borderRadius: "40px",
                        padding: "5px",
                        color: "white",
                        fontSize: ".6rem",
                        fontWeight: "bold",
                        letterSpacing: "2px",
                      }}
                    >
                      {`₦${item.previous_price.toLocaleString()}`}
                    </span>
                  </Col>
                  <Col xs={8} sm={8} md={6} lg={6}>
                    <span
                      style={{
                        color: color,
                        fontSize: ".8rem",
                        fontWeight: "bold",
                        marginLeft: "1rem",
                      }}
                    >
                      {`${sign} ₦${Math.abs(
                        item.current_price - item.previous_price
                      ).toLocaleString()}`}
                    </span>
                  </Col>
                  <Col xs={4} sm={4} md={8} lg={6}>
                    <span
                      className="italic"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "auto",
                        fontSize: ".7rem",
                        textDecoration: "italic",
                        marginRight: "rem",
                      }}
                    >
                      {" "}
                      {`(₦${item.current_price.toLocaleString()})`}
                    </span>
                  </Col>{" "}
                </Row>
              }
              status="finish"
              icon={
                <div
                  style={{
                    marginLeft: "2px",
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#658127",
                  }}
                />
              }
            />
          );
        })}
      </Steps>
    </div>
  );
};
function getColor(index: number) {
  switch (index) {
    case 0:
      return "#587DBD";
    case 1:
      return "#E36C29";
    case 2:
      return "#658127";
    case 3:
      return "#7258BD";
    case 4:
      return "#D83131";
    default:
      return "#658127";
  }
}

export default Analysis;

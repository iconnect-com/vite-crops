/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Col, Table, Select, DatePicker, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { LineChart } from "../../../../components";
import { DataContext } from "../../../../context/DataContext";
import type { TableColumnsType } from "antd";
import { Dayjs } from "dayjs";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useGetConfiguration } from "../../hooks";
import { errorAlert } from "../../../../utils";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import type { MenuProps } from "antd";

interface ICommodity {
  _id: string;
  name: string;
  previous_price: number;
  current_price: number;
  data: any[];
  effective_date: any;
  effective_time: string;
}

const ReportingPage: React.FC = () => {
  const { data: MarketPrices } = useGetConfiguration();
  const { publicCommodities } = useContext(DataContext);

  const mappedData = MarketPrices?.map((item: any, index: any) => ({
    ...item,
    index,
  }));

  const [activeItem, setActiveItem] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filterData, setFilterData] = useState<ICommodity[]>([]);
  const [exportType, setExportType] = useState<"pdf" | "xlsx">("pdf");
  const [shouldExport, setShouldExport] = useState(false);
  const [yearFilteredData, setYearFilteredData] = useState<ICommodity[]>([]);
  const [commodityDatas, setCommodityDatas] = useState<ICommodity[]>([]);
  const [commodityDetails, setCommodityDetails] = useState<
    ICommodity | undefined
  >(undefined);

  const [commodityData, setCommodityData] = useState<ICommodity | undefined>(
    undefined
  );
  const [commodityName, setCommodityName] = useState<string | undefined>(
    undefined
  );

  const selectedCommodity = publicCommodities?.[activeItem];

  const CheckName = () => {
    const commodity = publicCommodities?.find(
      (commodity) => commodity._id === String(activeItem)
    );
    return commodity?.name;
  };

  useEffect(() => {
    if (activeItem) {
      setCommodityName(CheckName());
    }
  }, [activeItem]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    new Set(
      mappedData?.map((item: { effective_date: string | number | Date }) =>
        new Date(item.effective_date).getFullYear()
      )
    )
  ) as number[];

  const months = Array.from(
    new Set(
      mappedData?.map(
        (item: { effective_date: string | number | Date }) =>
          monthNames[new Date(item.effective_date).getMonth()]
      )
    )
  ) as string[];

  const handleYearChange = (value: any) => {
    const CommodityData = mappedData?.filter(
      (item: any) => item.commodity._id === activeItem
    );
    setCommodityDatas(CommodityData);

    if (value) {
      const filteredData = CommodityData?.filter(
        (item: any) => new Date(item.effective_date).getFullYear() === value
      );
      setYearFilteredData(filteredData || []);
    } else {
      setFilterData(CommodityData || []);
    }
  };

  const handleMonthChange = (value: any) => {
    const CommodityData = yearFilteredData;

    if (value) {
      const monthNumber = monthNames.indexOf(value);
      const filteredData = CommodityData?.filter(
        (item: any) => new Date(item.effective_date).getMonth() === monthNumber
      );
      setFilterData(filteredData || []);
    } else {
      setFilterData(CommodityData || []);
    }
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (shouldExport) {
      handleExport();
      setShouldExport(false);
    }
  }, [shouldExport]);

  const handleExport = async () => {
    if (!activeItem) {
      return;
    }
    if (exportType === "pdf") {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const captureElement = async (id: string, x: number, y: number) => {
        const element = document.getElementById(id);
        if (element) {
          const canvas = await html2canvas(element);
          const imgData = canvas.toDataURL("image/png");

          const widthRatio = pageWidth / canvas.width;
          const heightRatio = pageHeight / canvas.height;
          const ratio = Math.min(widthRatio, heightRatio);

          const imgWidth = canvas.width * ratio - 20;
          const imgHeight = canvas.height * ratio - 20;

          // Add header
          doc.setFontSize(16);
          doc.text("Commodity Report", pageWidth / 2, 20, { align: "center" });
          doc.setFontSize(12);

          doc.text(
            `Commodity Name: ${commodityName}`,
            10, // Adjust x-coordinate to align text to the left
            30,
            {
              align: "left",
            }
          );

          // doc.text(
          //   `Commodity Previous Price: ${selectedCommodity?.previous_price}`,
          //   10, // Adjust x-coordinate to align text to the left
          //   35, // Adjust y-coordinate to place it below the commodity name
          //   {
          //     align: "left",
          //   }
          // );

          // doc.text(
          //   `Commodity New Price: ${selectedCommodity?.current_price}`,
          //   10, // Adjust x-coordinate to align text to the left
          //   40, // Adjust y-coordinate to place it below the commodity name
          //   {
          //     align: "left",
          //   }
          // );

          // doc.text(`Expert Analysis: ${selectedCommodity?.analysis}`, 10, 50, {
          //   align: "left",
          // });

          // Adjust y-coordinate for the image based on the height of the header
          const headerHeight = 40;
          const imageY = y + headerHeight;

          doc.addImage(imgData, "PNG", x, imageY, imgWidth, imgHeight);

          return imgHeight;
        }
      };

      try {
        // Add a delay before capturing the elements
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const chartHeight = await captureElement("line-chart", 7, 30);
        if (chartHeight) {
          await captureElement("table", 10, chartHeight + 20); // Place the table 20 units below the graph
        }
        doc.save("download.pdf");
      } catch (error) {
        errorAlert("Error while exporting");
      }
    } else if (exportType === "xlsx") {
      try {
        const commodityData = mappedData?.filter(
          (item: any) => item.commodity._id === activeItem
        );

        const worksheet = XLSX.utils.aoa_to_sheet(
          commodityData.map(
            (item: {
              number: number;
              commodity: { name: string };
              new_price: number;
              effective_date: string;
            }) => [
              item.number,
              item.commodity.name,
              item.new_price,
              item.effective_date,
            ]
          )
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CommodityData");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "buffer",
        });
        const data = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        saveAs(data, `commodity_${activeItem}_data.xlsx`);
      } catch (error) {
        errorAlert("Error while exporting");
      }
    }
  };

  const handleDateChange = (
    date: Dayjs | null,
    dateString: string | string[]
  ) => {
    const CommodityData = mappedData?.filter(
      (item: any) => item.commodity._id === activeItem
    );

    if (date) {
      const filteredData = CommodityData?.filter(
        (item: ICommodity) => item.effective_date === dateString
      );

      setFilterData(filteredData || []);
    } else {
      setFilterData(CommodityData || []);
    }
    setShowCalendar(false);
  };

  useEffect(() => {
    handleDateChange(null, "");
  }, [activeItem]);

  const handleReset = () => {
    setFilterData(commodityDatas || []);
    setYearFilteredData([]);
    setFilterData([]);
    setCommodityName("");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "pdf",
      label: "Export as PDF",
    },
    {
      key: "xlsx",
      label: "Export as XLSX",
    },
  ];

  const columns: TableColumnsType<ICommodity> = [
    {
      title: "S/N",
      dataIndex: "number",
      width: 80,
      key: "number",
      align: "center",
      render: (text, record, index) => index + 1,
    },

    {
      title: "Commodity",
      dataIndex: "commodity",
      align: "left",
      key: "name",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text?.name || ""}
        </div>
      ),
    },

    {
      title: "Price",
      dataIndex: "new_price",
      align: "left",
      key: "current_price",
      width: 150,
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text?.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "effective_date",
      align: "left",
      width: 150,
      key: "effective_date",
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Time",
      dataIndex: "effective_time",
      align: "left",
      width: 150,
      key: "effective_date",
      render: (text) => (
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          {text}
        </div>
      ),
    },
  ];

  const lineChartData = useMemo(() => {
    if (!commodityName) return [];

    // Initialize an array to store the count of commodities for each month
    const countsByMonth = Array(12).fill(0);

    // Filter data based on the selected commodity
    const filteredData = mappedData?.filter(
      (item: any) => item.commodity._id === activeItem
    );

    if (!filteredData) return [];

    // Count the number of commodities for each month
    filteredData.forEach((item: any) => {
      const month = new Date(item.effective_date).getMonth();
      countsByMonth[month]++;
    });

    // Prepare series data
    const seriesData = [
      {
        name: commodityName,
        data: countsByMonth,
      },
    ];

    return seriesData;
  }, [activeItem, commodityName, mappedData, monthNames]);

  return (
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

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-end w-[600px] sm:gap-8 mt-8">
          {/* Div to select a commodity */}

          <div className="flex w-[600px] sm:mt-8">
            <Select
              className="w-[100px]"
              onChange={(value) => setActiveItem(value)}
              placeholder="Commodity"
              style={{
                backgroundColor: "#EBE9E9",
                borderRadius: 0,
                minWidth: "200px",
              }}
            >
              {publicCommodities?.map((commodity, index) => (
                <Select.Option key={commodity._id} value={commodity._id}>
                  {commodity?.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* <div className="flex w-[600px] mt-4 sm:mt-8">
            <DatePicker className="" onChange={handleDateChange} />
          </div> */}

          {/* Div for selecting a year */}
          <div className="flex w-[600px] mt-4 sm:mt-8">
            <Select
              className="w-[100px]"
              onChange={handleYearChange}
              placeholder="Year"
              style={{
                backgroundColor: "#EBE9E9",
                borderRadius: 0,
                minWidth: "200px",
              }}
            >
              {years.map((year) => (
                <Select.Option key={year} value={year}>
                  {year}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Div for selecting a month */}
          <div className="flex w-[600px] mt-4 sm:mt-8">
            <Select
              className="w-[100px]"
              onChange={handleMonthChange}
              placeholder="Month"
              style={{
                backgroundColor: "#EBE9E9",
                borderRadius: 0,
                minWidth: "200px",
              }}
            >
              {months.map((month) => (
                <Select.Option key={month} value={month}>
                  {month}
                </Select.Option>
              ))}
            </Select>{" "}
          </div>

          {/* Div for the Export */}
          <div className="flex w-[600px] mt-4 sm:mt-8">
            <Dropdown
              menu={{
                items: menuItems,
                onClick: ({ key }) => {
                  setExportType(key as "pdf" | "xlsx");
                  setShouldExport(true);
                },
              }}
              trigger={["click"]}
            >
              <Button style={{ fontSize: "1rem" }}>Export</Button>
            </Dropdown>
          </div>

          {/* Div for the resseting fields */}
          <div className="flex w-[600px] mt-4 sm:mt-8">
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </div>

        {/* Div to render data */}

        <div className="p-10 bg-white w-full flex items-center justify-center">
          <Col xs={24} sm={24} md={24} lg={24}>
            {activeItem ? (
              <>
                <div
                  style={{ margin: 5 }}
                  className="sm:px-20 bg-white w-full flex items-center justify-center"
                >
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <div id="line-chart">
                      <LineChart data={lineChartData} />
                    </div>

                    <div id="table" className="mt-10">
                      <Table
                        columns={columns}
                        rowKey="_id"
                        dataSource={filterData}
                        size="middle"
                        // pagination={{
                        //   pageSizeOptions: ["5", "10", "15"],
                        //   showSizeChanger: false,
                        // }}
                      />
                    </div>
                  </Col>
                </div>
              </>
            ) : (
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className="p-48 bg-white w-full flex items-center justify-center">
                  <p>Select a Commodity</p>
                </div>
              </Col>
            )}
          </Col>
        </div>
      </div>
    </div>
  );
};

export default ReportingPage;

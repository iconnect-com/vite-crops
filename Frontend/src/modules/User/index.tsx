import React, { useContext, useEffect, useMemo, useState } from "react";
import Layouts from "../../layout/Users";
import backs from "../../assets/medium-shot-woman-ii.jpg";
import { Analysis, Weather } from "../../components";
import {
  Row,
  Col,
  Select,
  Modal,
  DatePicker,
  Button,
  Form,
  Spin,
  Image,
} from "antd";
import { DataContext } from "../../context/DataContext";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import LineChart from "../../components/charts/LineChart";
import {
  useAddAlerts,
  useGetAllCommodity,
  useGetConfiguration,
} from "../Admin/hooks";
import { CalendarFilled, CalendarOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context";
import { queryKeys } from "../../react-query/constants";
import { Dayjs } from "dayjs";
import { useGetExchangeRate } from "../../hooks/auth";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { errorAlert } from "../../utils";
import { Iconify } from "../../components/icon";
import { ICommodity } from "../../interface";

interface FormData {
  alert: string;
}

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { data: MarketPrices } = useGetConfiguration();

  const { publicCommodities } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const commodities = useGetAllCommodity();

  const mappedData = MarketPrices?.map((item: any, index: any) => ({
    ...item,
    index,
  }));

  // All currency codes and symbols
  const currencies = [
    { id: 0, name: "Select Currency", code: "", symbol: "" },
    { id: 1, name: "Dollar (US)", code: "USD", symbol: "$" },
    { id: 2, name: "Euro (EU)", code: "EUR", symbol: "€" },
    { id: 3, name: "Pound (UK)", code: "GBP", symbol: "£" },
    { id: 4, name: "Swiss Franc (SUI)", code: "CHF", symbol: "CHF" },
    { id: 6, name: "Yen (JPN)", code: "JPY", symbol: "¥" },
    { id: 7, name: "Rand (SA)", code: "ZAR", symbol: "R" },
    { id: 8, name: "Rupee (IND)", code: "INR", symbol: "₹" },
    { id: 9, name: "Peso (MEX)", code: "MXN", symbol: "$" },
    { id: 10, name: "Canadian Dollar (CAD)", code: "CAD", symbol: "C$" },
  ];

  const [formData, setFormData] = useState<FormData>({
    alert: "",
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [commodityID, setCommodityID] = useState<string | undefined>(undefined);

  const selectedCommodity = publicCommodities?.[activeItem];

  const [selectedCurrency, setSelectedCurrency] = React.useState(
    currencies[0].code
  );

  const selectedCurrencyObject = currencies.find(
    (currency) => currency.code === selectedCurrency
  );

  const [exchangeRates, setExchangeRates] = useState<any>({});
  const [changedPRates, setChangedPRates] = useState<any>({});
  const [changedCRates, setChangedCRates] = useState<any>({});
  const exchangeRateData = useGetExchangeRate("USD");
  const [commodityName, setCommodityName] = useState<string | undefined>(
    undefined
  );

  const CheckName = () => {
    const commodity = publicCommodities?.find(
      (commodity) => commodity._id === commodityID
    );
    return commodity?.name;
  };

  useEffect(() => {
    if (activeItem) {
      setCommodityName(CheckName());
    }
  }, [activeItem]);

  // API Data for currency conversion
  const current = exchangeRateData?.conversion_rates
    ? exchangeRateData.conversion_rates[selectedCurrency]
    : undefined;

  const PriceInUSD = exchangeRateData.conversion_rates?.NGN || 0;
  const CurrentPrice = selectedCommodity?.current_price;
  const PreviousPrice = selectedCommodity?.previous_price;

  // Calculate the converted current price
  const calculateConvertedCPrice = (price: number) => {
    if (exchangeRates) {
      if (selectedCurrency === "USD") {
        return CurrentPrice / PriceInUSD;
      } else {
        const priceIn = CurrentPrice / PriceInUSD;
        return priceIn * current;
      }
    }
    return null;
  };

  // Calculate the converted previous price
  const calculateConvertedPPrice = (price: number) => {
    if (exchangeRates) {
      if (selectedCurrency === "USD") {
        return PreviousPrice / PriceInUSD;
      } else {
        const priceIn = PreviousPrice / PriceInUSD;
        return priceIn * current;
      }
    }
    return null;
  };

  const convertedPrevioustPrice = calculateConvertedPPrice(PreviousPrice);
  const convertedCurrentPrice = calculateConvertedCPrice(CurrentPrice);

  useEffect(() => {
    setExchangeRates(current || {});
    setChangedPRates(convertedPrevioustPrice || PreviousPrice);
    setChangedCRates(convertedCurrentPrice || CurrentPrice);
  }, [
    current,
    convertedPrevioustPrice,
    convertedCurrentPrice,
    PreviousPrice,
    CurrentPrice,
  ]);

  const { mutate } = useAddAlerts(user?._id as any);
  const isLoading = useIsMutating();
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // mutate(selectedUser.key as any);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleSelectChange = (field: keyof FormData, values: string) => {
    setFormData((prevState) => ({ ...prevState, [field]: values }));
  };

  const handleCurrencyChange = (value: any) => {
    setSelectedCurrency(value);
  };

  const handleDateChange = (
    date: Dayjs | null,
    dateString: string | string[]
  ) => {
    if (typeof dateString === "string") {
    }
    setShowCalendar(false);
  };

  const [open, setOpen] = useState(false);

  const handleExport = async () => {
    if (!activeItem) {
      return;
    }
    if (selectedCommodity) {
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
            `Commodity Name: ${selectedCommodity?.name}`,
            10, // Adjust x-coordinate to align text to the left
            30,
            {
              align: "left",
            }
          );
          doc.text(
            `Commodity Previous Price: ${selectedCommodity?.previous_price}`,
            10, // Adjust x-coordinate to align text to the left
            35, // Adjust y-coordinate to place it below the commodity name
            {
              align: "left",
            }
          );

          doc.text(
            `Commodity New Price: ${selectedCommodity?.current_price}`,
            10, // Adjust x-coordinate to align text to the left
            40, // Adjust y-coordinate to place it below the commodity name
            {
              align: "left",
            }
          );

          doc.text(`Expert Analysis: ${selectedCommodity?.analysis}`, 10, 50, {
            align: "left",
          });

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
          // await captureElement("analysis", 10, chartHeight + 70); // Place the table 20 units below the graph and adjust for the header
        }
        doc.save("download.pdf");
      } catch (error) {
        errorAlert("Error while exporting");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("alert", formData?.alert || "");
    mutate(data as any, {
      onSuccess: () => {
        form.resetFields();
        queryClient.invalidateQueries([queryKeys.notification]);
        setIsModalOpen(false);
      },
    });
  };

  const lineChartData = useMemo(() => {
    if (!commodityName) return [];

    // Initialize an array to store the count of commodities for each month
    const countsByMonth = Array(12).fill(0);

    // Filter data based on the selected commodity
    const filteredData = mappedData?.filter(
      (item: any) => item.commodity._id === commodityID
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
  }, [commodityID, commodityName, mappedData]);

  return (
    <Layouts Heading="Dashboard" Background={backs}>
      <div className="flex flex-col sm:flex-row">
        <Analysis data={commodities} />
        <Weather forecasts={[]} />
      </div>
      <div className="mt-9 w-full sm:w-full">
        <Row gutter={12} className="gap-4 sm:gap-0">
          <Col xs={24} sm={24} md={4} lg={4}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: ".8px",
                color: "white",
                marginBottom: "1rem",
                paddingLeft: "2rem",
                background: "#658127",
                width: "100%",
                height: "40px",
                display: "flex",
                alignItems: "center",
              }}
            >
              Available Crops{" "}
            </div>
            {publicCommodities?.map((commodity, index) => (
              <div
                key={commodity._id}
                onClick={() => {
                  setCommodityID(commodity._id);
                  setActiveItem(index);
                }}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  fontSize: "12px",
                  background: activeItem === index ? "#d0d0d0" : "#f0f0f0",
                }}
              >
                {commodity.name}
              </div>
            ))}
          </Col>
          <Col xs={24} sm={24} md={4} lg={4}>
            <div className="flex flex-row mb-7">
              <div className="font-bold text-sm">Price History </div>{" "}
              <span
                style={{
                  borderRadius: "20px",
                  padding: "5px",
                  fontSize: ".6rem",
                  fontWeight: "bold",
                  letterSpacing: ".8px",
                  color: "#39462D",
                  marginLeft: "1rem",
                  background: "#65812729",
                }}
              >
                Today{" "}
              </span>
              <div
                className="ml-5"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <CalendarOutlined />
              </div>
              {showCalendar && (
                <>
                  <DatePicker
                    open={showCalendar}
                    // open={open}
                    onChange={handleDateChange}
                    onOpenChange={setOpen}
                    style={{ width: 0, visibility: "hidden" }}
                    popupStyle={{ visibility: "visible" }}
                    variant="borderless"
                  />
                </>
              )}
            </div>
            <Image
              style={{
                borderRadius: "5px",
                height: "50%",
                width: "100%",
                objectFit: "cover",
              }}
              src={
                Array.isArray(selectedCommodity?.image)
                  ? selectedCommodity?.image[0]
                  : selectedCommodity?.image || ""
              }
              // alt={selectedCommodity?.name}
              fallback="https://via.placeholder.com/150"
              placeholder={
                <div
                  style={{
                    height: "50%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spin size="large" />
                </div>
              }
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <div className="lg:ml-8">
              <div className="flex flex-row mb-7 lg:mt-12">
                <div className="font-bold text:2xl lg:text-3xl ">
                  {selectedCommodity?.name}
                </div>
                <span
                  onClick={showModal}
                  style={{
                    outline: ".5px solid #000",
                    borderRadius: "40px",
                    padding: "9px",
                    fontSize: ".7rem",
                    fontWeight: "bold",
                    letterSpacing: ".8px",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    marginLeft: "1rem",
                    cursor: "pointer",
                  }}
                >
                  Price Alert{" "}
                </span>
              </div>
              <div>
                <Modal
                  title="Set Price Alert"
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  width={400}
                  footer={null}
                  centered
                >
                  <Form
                    name="Price Alert"
                    onFinish={mutate}
                    className="flex flex-col  mb-4 mt-12 justify-center bg-white w-full"
                    form={form}
                    requiredMark={false}
                    layout="vertical"
                  >
                    <Form.Item
                      label="Select Crop"
                      name="commodity"
                      rules={[
                        {
                          required: true,
                          message: "Please select a Commodity",
                        },
                      ]}
                    >
                      <Select
                        options={publicCommodities?.map((commodity) => ({
                          label: commodity.name,
                          value: commodity._id,
                        }))}
                        allowClear
                        filterOption={(input: string, option) => {
                          return option?.label
                            .toLowerCase()
                            .includes(input.toLowerCase()) as boolean;
                        }}
                        showSearch
                        className=" w-full"
                        value={formData?.alert || ""}
                        onChange={(value) => handleSelectChange("alert", value)}
                        style={{
                          backgroundColor: "#EBE9E9",
                          marginTop: "-2rem",
                          marginBottom: "1rem",
                        }}
                      />
                    </Form.Item>

                    <div className="flex justify-end">
                      <Form.Item>
                        <Button
                          onClick={handleSubmit}
                          name="email"
                          type="primary"
                          htmlType="submit"
                          className="w-30 rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
                          style={{
                            background:
                              "linear-gradient(89.46deg, #39462D 13.05%, #658127 107.23%)",
                            color: "white",
                          }}
                          loading={Boolean(isLoading)}
                        >
                          Submit{" "}
                        </Button>
                      </Form.Item>
                    </div>
                  </Form>
                </Modal>
              </div>
              <div className="flex flex-row mb-4">
                <div className=" text-sm mr-4">Previous Price</div>
                <div className=" text-sm text-bold">
                  {" "}
                  {/* {`${(changedPRates || "").toLocaleString()}`} */}
                  {selectedCurrencyObject?.symbol || "₦"}{" "}
                  {(changedPRates || "").toLocaleString()}
                </div>
              </div>
              <div className="flex flex-row mb-7">
                <div className=" text-sm mr-4">Current Price</div>
                <div className=" text-sm text-bold">
                  {" "}
                  {/* {`${(changedCRates || "").toLocaleString()}`} */}
                  {selectedCurrencyObject?.symbol || "₦"}{" "}
                  {(changedCRates || "").toLocaleString()}
                </div>
              </div>
            </div>

            {/* Div for the Line Graph*/}
            <div id="line-chart">
              <LineChart data={lineChartData} />
            </div>
          </Col>

          <Col xs={24} sm={24} md={4} lg={4} className="lg:mt-12">
            <Select
              defaultValue={currencies[0].name}
              style={{ width: "100%" }}
              onChange={handleCurrencyChange}
            >
              {currencies.map((currency) => (
                <Select.Option key={currency.id} value={currency.code}>
                  {currency.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
      <div className="mt-1 w-[350px] sm:w-full">
        <Row gutter={12} className="gap-1 sm:gap-0">
          <Col xs={24} sm={24} md={4} lg={4}></Col>
          <Col xs={24} sm={24} md={4} lg={4}></Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <div className="lg:ml-10 flex flex-col mb-5 gap-2">
              <div className="flex flex-row">
                <div
                  style={{
                    borderRadius: "20px",
                    padding: "5px",
                    fontSize: ".8rem",
                    fontWeight: "bold",
                    color: "white",
                    background: "#658127",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="ml-3 flex w-[200px] mt-4 sm:mt-8"
                >
                  Expert Analysis
                </div>
                <div className="ml-3 mr-8 flex w-[600px] mt-4 sm:mt-8">
                  <Button
                    type="default"
                    onClick={handleExport}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Iconify size={18} icon="line-md:download-loop" />
                    Export
                  </Button>
                </div>
              </div>

              <div id="analysis" className="ml-2 text-sm mt-5">
                {selectedCommodity?.analysis}
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={4} lg={4}></Col>
        </Row>
      </div>
    </Layouts>
  );
};

export default Dashboard;

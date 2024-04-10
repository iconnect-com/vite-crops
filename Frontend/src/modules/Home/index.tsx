import { Button } from "antd";
import Analysis from "../../components/MarketAnalysis";
import { Weather } from "../../components";
import image from "../../assets/medium-shot-woman-ii.jpg";
import nirsal from "../../assets/download.jpeg";
import nigeria from "../../assets/nigeria.png";
import { Link, useNavigate } from "react-router-dom";
import { useGetExchangeRate } from "../../hooks/auth";
import { useGetAllCommodity } from "../Admin/hooks";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";

const HomeScreen = () => {
  const navigate = useNavigate();
  const commodities = useGetAllCommodity();
  const handleSignup = () => {
    navigate("/create-account");
  };

  const handleAdmin = () => {
    navigate("/admin/login");
  };
  const exchangeRateData = useGetExchangeRate("USD");
  const current = exchangeRateData?.conversion_rates;
  const { publicCommodities } = useContext(DataContext);

  return (
    <>
      <div className="w-full h-full overflow-x-hidden">
        <div className="py-5 ml-10">
          <Link to="/">
            <img className="h-12 w-17" src={nirsal} alt="ChitChat Logo" />
          </Link>
        </div>{" "}
        <div
          className="h-[400px] sm:h-[700px] w-full flex items-start bg-cover bg-center px-10 pt-12 md:pb-20 pb-5 text-white"
          style={{
            backgroundImage: `linear-gradient(89.36deg, #39462D 38.02%, rgba(57, 70, 45, 0.24) 123.04%),url(${image})`,
          }}
        >
          <div className="flex flex-col h-full sm:mt-20 ">
            <div className="md:text-[44px] text-[20px] font-[600]">NIRSAL </div>
            <div className="md:text-[60px] text-[25px] font-[600]">
              <div>Commodity</div>
              <div>Virtual Dashboard</div>
            </div>

            <div className="sm:mt-8 md:text-[18px] text-[14px] md:w-[60%] w-full md:leading-[40px] py-1">
              Experience efficiency at your fingertips with our commodity
              virtual dashboard. Monitor and analyze market trends, track
              investments, and make informed decisions with real-time data.
              Simplify your commodity management and stay ahead of the game with
              our intuitive dashboard interface.
            </div>

            <div className="flex gap-1 mt-10 sm:mt-20  ">
              <img className="h-6 w-6 mr-1 " src={nigeria} alt="Nigeria Logo" />

              <span className="w-full sm:max-w-[470px] text-1xl sm:text-1xl text-white">
                Dollar to Naira - ₦ {current?.NGN}
              </span>
            </div>
          </div>
          <div />
        </div>
        <div className="flex gap-6 items-center mx-10 my-12">
          <Link to="/login" className="  text-green-900 text-sm font-bold">
            Login{" "}
          </Link>
          <Button
            onClick={handleSignup}
            type="primary"
            className="w-30 h-10 text:xs"
            style={{
              background:
                "linear-gradient(89.46deg, #39462D 13.05%, #658127 107.23%)",
              color: "white",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            Sign Up{" "}
          </Button>

          <Button
            onClick={handleAdmin}
            type="default"
            style={{
              color: "black",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            Admin{" "}
          </Button>
        </div>
        <div className="mx-10 sm:mx-10 flex max-md:flex-col flex-row gap-5 md:mb-40 mb:5 w-[90%]">
          <Analysis data={commodities} />
          <Weather forecasts={[]} />
        </div>
      </div>
    </>
  );
};

export default HomeScreen;

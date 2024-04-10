import ReactApexChart from "react-apexcharts";
import lineChart from "./configs/lineChart";

interface LineChartProps {
  data: {
    name: string;
    data: number[];
  }[];
}

function LineChart({ data }: LineChartProps) {
  return (
    <>
      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={data}
        type="area"
        height={400}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;

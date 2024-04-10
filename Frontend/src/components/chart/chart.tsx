import { memo } from "react";
import ApexChart from "react-apexcharts";
import { StyledApexChart } from "./styles";
import type { Props as ApexChartProps } from "react-apexcharts";

function Chart(props: ApexChartProps) {
  return (
    <StyledApexChart>
      <ApexChart {...props} />
    </StyledApexChart>
  );
}

export default memo(Chart);

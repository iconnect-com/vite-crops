import type { Dayjs } from "dayjs";
import React from "react";
import { Calendar, theme } from "antd";
import type { CalendarProps } from "antd";

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {};

const Calendars: React.FC = () => {
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: "100%", // default to full width
    maxWidth: "450px", // limit maximum width to 450px
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onPanelChange={onPanelChange} />
    </div>
  );
};

export default Calendars;

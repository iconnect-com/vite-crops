import { useState } from "react";
import TableComponent from "./TableComponent";
import { DatePicker } from "antd";
import { Dayjs } from "dayjs";

const DashboardTable = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const handleDateChange = (
    date: Dayjs | null,
    dateString: string | string[]
  ) => {
    setShowCalendar(false);
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 mt-4">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="relative flex items-center justify-center gap-2 bg-[#658127] bg-opacity-10 rounded-md py-2 px-4"
        >
          <p className="text-[#658127] text-[16px] font-medium">
            Price history
          </p>
          <span className="w-6 h-6 flex items-center justify-center">
            <svg
              width="10"
              height="6"
              className={`transform ${showCalendar ? "rotate-180" : ""}`}
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.99984 5.99975L0.756836 1.75775L2.17184 0.34375L4.99984 3.17175L7.82784 0.34375L9.24284 1.75775L4.99984 6.00075V5.99975Z"
                fill="#658127"
              />
            </svg>
          </span>
        </button>
      </div>
      {showCalendar && (
        <DatePicker
          open={showCalendar}
          onChange={handleDateChange}
          className="border-gray-300 rounded-none"
          name="effective_date"
          style={{ backgroundColor: "#EBE9E9", marginTop: "-2rem" }}
        />
      )}
      <div className="h-full sm:h-96 mx-auto pr-0 sm:pr-9 w-full">
        <TableComponent />
      </div>
    </div>
  );
};

export default DashboardTable;

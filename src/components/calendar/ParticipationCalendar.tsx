import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

interface ParticipationCalendarProps {
  eventDates: string[];
  onDateClick: (date: string) => void;
  selectedDate: string | null;
}

const ParticipationCalendar = ({
  eventDates,
  onDateClick,
  selectedDate,
}: ParticipationCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const weeks: dayjs.Dayjs[][] = [];
  let currentWeek: dayjs.Dayjs[] = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
    currentWeek.push(currentDate);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate = currentDate.add(1, "day");
  }

  const hasEvent = (date: dayjs.Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    return eventDates.includes(dateStr);
  };

  const isToday = (date: dayjs.Dayjs) => {
    return date.isSame(dayjs(), "day");
  };

  const isCurrentMonth = (date: dayjs.Dayjs) => {
    return date.month() === currentMonth.month();
  };

  const isSelected = (date: dayjs.Dayjs) => {
    return selectedDate === date.format("YYYY-MM-DD");
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-red-500 rounded transition-colors">
          <ChevronLeft className="text-white" size={24} />
        </button>
        <h3 className="text-white font-bold text-lg">
          {currentMonth.format("YYYY年 M月")}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-red-500 rounded transition-colors">
          <ChevronRight className="text-white" size={24} />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["日", "月", "火", "水", "木", "金", "土"].map((day, idx) => (
            <div
              key={day}
              className={`text-center text-sm font-semibold py-2 ${
                idx === 0
                  ? "text-red-600"
                  : idx === 6
                  ? "text-blue-600"
                  : "text-gray-700"
              }`}>
              {day}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {week.map((date, dayIdx) => {
                const hasEventOnDate = hasEvent(date);
                const isTodayDate = isToday(date);
                const isCurrentMonthDate = isCurrentMonth(date);
                const isSelectedDate = isSelected(date);

                return (
                  <button
                    key={dayIdx}
                    onClick={() =>
                      hasEventOnDate && onDateClick(date.format("YYYY-MM-DD"))
                    }
                    disabled={!hasEventOnDate}
                    className={`
                      relative aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                      ${!isCurrentMonthDate ? "text-gray-300" : ""}
                      ${
                        dayIdx === 0
                          ? "text-red-600"
                          : dayIdx === 6
                          ? "text-blue-600"
                          : "text-gray-800"
                      }
                      ${isTodayDate ? "ring-2 ring-red-400" : ""}
                      ${isSelectedDate ? "bg-red-100 ring-2 ring-red-500" : ""}
                      ${
                        hasEventOnDate && !isSelectedDate
                          ? "hover:bg-gray-100 cursor-pointer"
                          : ""
                      }
                      ${!hasEventOnDate ? "cursor-default" : ""}
                    `}>
                    <span className="relative z-10">{date.date()}</span>
                    {hasEventOnDate && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipationCalendar;

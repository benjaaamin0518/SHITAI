import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

dayjs.extend(relativeTime);
dayjs.locale("ja");

export const formatDate = (
  date: string | Date,
  format = "YYYY/MM/DD"
): string => {
  return dayjs(date).format(format);
};

export const formatDisplayDate = (
  date: string | Date,
  format = "YYYY/MM/DD HH:mm"
): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format("YYYY-MM-DDTHH:mm");
};

export const getRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

export const getTimeRemaining = (
  deadline: string | Date
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  text: string;
} => {
  const now = dayjs();
  const target = dayjs(deadline);
  const diff = target.diff(now);

  if (diff < 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
      text: "期限切れ",
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let text = "";
  if (days > 0) {
    text = `残り ${days}日 ${hours}時間`;
  } else if (hours > 0) {
    text = `残り ${hours}時間 ${minutes}分`;
  } else if (minutes > 0) {
    text = `残り ${minutes}分`;
  } else {
    text = `残り ${seconds}秒`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    expired: false,
    text,
  };
};

export const isDateInPast = (date: string | Date): boolean => {
  return dayjs(date).isBefore(dayjs());
};

export const addDays = (date: string | Date, days: number): string => {
  return dayjs(date).add(days, "day").toISOString();
};

export const addHours = (date: string | Date, hours: number): string => {
  return dayjs(date).add(hours, "hour").toISOString();
};

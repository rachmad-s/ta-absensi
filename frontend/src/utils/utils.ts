import { createElement } from "react";
import { Navigate } from "react-router-dom";
import { Error403 } from "./components";
import { Roles, User } from "./models/user.model";
import { OptionType } from "./types";

export const getOptionsArray = <T>(
  data: T[] | undefined,
  getProperty: (data: T) => { label: string; value: string }
): OptionType[] => {
  if (!data) return [];
  return data.map((d) => ({
    value: getProperty(d).value,
    label: getProperty(d).label,
  }));
};

export const presetValidation = (type: string, value: number) => {
  switch (type) {
    case "minLength":
      return {
        value,
        message: `Minimal ${value} karakter`,
      };
    case "maxLength":
      return {
        value,
        message: `Maksimal ${value} karakter`,
      };

    default:
      return undefined;
  }
};

export const minutes = (minute: number) => 60000 * minute;

export const LEVEL_ENUM: { [key: string]: string } = {
  "0": "Intern",
  "1": "Junior Staff",
  "2": "Mid-level Staff",
  "3": "Senior",
  "4": "Manager",
  "5": "Director",
};

const MINIMUM_YEAR = 2022;

export const getAvailableYear = () => {
  const years = [];
  let startYear = MINIMUM_YEAR;
  while (startYear <= new Date().getFullYear()) {
    years.push(startYear);
    startYear += 1;
  }
  return years;
};

export const MONTHS: { [key: string]: string } = {
  "0": "Januari",
  "1": "Februari",
  "2": "Maret",
  "3": "April",
  "4": "Mei",
  "5": "Juni",
  "6": "Juli",
  "7": "Agustus",
  "8": "September",
  "9": "Oktober",
  "10": "November",
  "11": "Desember",
};

export const DAYS: { [key: string]: string } = {
  "0": "Minggu",
  "1": "Senin",
  "2": "Selasa",
  "3": "Rabu",
  "4": "Kamis",
  "5": "Jumat",
  "6": "Sabtu",
};

export const getTimeOffNameLabel = (name: string) => {
  const labels: {
    [key: string]: string;
  } = {
    ANNUAL_LEAVE: "Cuti Tahunan",
    SICK_LEAVE: "Cuti Sakit",
    MARRIAGE_LEAVE: "Cuti Menikah",
  };
  return labels[name];
};

export const COMMON_TIME_FORMAT = "HH:mm:ss";
export const COMMON_DATE_ONLY = "DD MMM yyyy";
export const COMMON_DATE_TIME = "DD MMM yyyy, HH:mm";

export const CURRENT_MONTH = new Date().getMonth().toString();
export const CURRENT_YEAR = new Date().getFullYear().toString();

export const monthOptions = Object.keys(MONTHS).map((month) => ({
  label: MONTHS[month],
  value: month,
}));

export const yearOptions = getAvailableYear().map((year) => ({
  label: year.toString(),
  value: year.toString(),
}));

export const getDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60) > 0 ? Math.floor(minutes / 60) : 0;
  const totalMinutes = minutes < 60 ? minutes : Math.floor(minutes % 60);
  return `${hours} jam ${totalMinutes > 0 ? totalMinutes + " menit" : ""}`;
};

export const withZero = (x: string | number) =>
  Number(x) < 10 ? "0" + String(x) : x;

export const accessControl = (
  component: JSX.Element,
  roles: Roles[] = [],
  condition?: (data: User) => boolean
) => {
  const localStorageAuth = localStorage.getItem("authentication");
  if (localStorageAuth === null) return Navigate({ to: "/login" });

  const userAuth = JSON.parse(localStorageAuth);
  const user = userAuth ? (userAuth.user as User) : undefined;

  if (user) {
    if (roles.includes(user.role)) return component;
    if (condition && condition(user)) return component;
  }
  return createElement(Error403);
};

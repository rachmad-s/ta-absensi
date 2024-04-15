import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  AttendanceByMonthYear,
  fetchMinimumAttendance,
} from "../api/attendance.api";
import { minutes } from "../utils";

export const useMinimumAttendanceQuery = (queries?: AttendanceByMonthYear) => {
  return useQuery({
    queryKey: ["minimumAttendance", { ...queries }],
    queryFn: () => fetchMinimumAttendance({ ...queries }),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

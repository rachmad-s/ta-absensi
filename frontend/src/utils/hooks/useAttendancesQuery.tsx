import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  FetchAllAttendanceByDate,
  FetchUserAttendanceByMonth,
  fetchAttendanceByDate,
  fetchUserAttendanceByMonth,
} from "../api/attendance.api";
import { minutes } from "../utils";

export const useAttendancesQuery = (queries?: FetchUserAttendanceByMonth) => {
  return useQuery({
    queryKey: ["attendances", { ...queries }],
    queryFn: () => fetchUserAttendanceByMonth({ ...queries }),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

export const useAllAttendancesQuery = (queries?: FetchAllAttendanceByDate) => {
  return useQuery({
    queryKey: ["attendances", { ...queries }],
    queryFn: () => fetchAttendanceByDate({ ...queries }),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FetchEmployeesAttendance, fetchEmployeesAttendance } from "../api/attendance.api";
import { minutes } from "../utils";

export const useEmployeesAttendanceQuery = (queries?: FetchEmployeesAttendance) => {
  return useQuery({
    queryKey: ["allAttendances", { ...queries }],
    queryFn: () => fetchEmployeesAttendance({ ...queries }),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

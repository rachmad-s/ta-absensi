import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  FetchTeamAttendanceByMonth,
  fetchTeamAttendanceByMonth,
} from "../api/attendance.api";
import { minutes } from "../utils";

export const useTeamAttendancesQuery = (
  queries?: FetchTeamAttendanceByMonth
) => {
  return useQuery({
    queryKey: ["attendances", { ...queries }],
    queryFn: () => fetchTeamAttendanceByMonth({ ...queries }),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

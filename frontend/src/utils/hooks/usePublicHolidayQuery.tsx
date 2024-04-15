import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  FetchPublicHolidayListParam,
  fetchPublicHolidayList,
} from "../api/publicHoliday.api";
import { minutes } from "../utils";

export const usePublicHolidayListQuery = (
  queries?: FetchPublicHolidayListParam
) => {
  return useQuery({
    queryKey: ["publicHolidays", { ...queries }],
    queryFn: () => fetchPublicHolidayList({ ...queries }),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

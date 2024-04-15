import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FetchOverTimeParams, fetchOverTime } from "../api/overTime";
import { minutes } from "../utils";

export const useOverTimeListQuery = (queries?: FetchOverTimeParams) => {
  return useQuery({
    queryKey: ["overTimes", { ...queries }],
    queryFn: () => fetchOverTime({ ...queries }),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

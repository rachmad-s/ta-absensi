import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { minutes } from "../utils";
import { FetchTimeOffParams, fetchTimeOff } from "../api/timeOff";

export const useTimeOffQuery = (queries?: FetchTimeOffParams) => {
  return useQuery({
    queryKey: ["timeOffs", { ...queries }],
    queryFn: () => fetchTimeOff({ ...queries }),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { minutes } from "../utils";
import { fetchTimeOffQuota } from "../api/timeOff";

export const useTimeOffQuotaQuery = () => {
  return useQuery({
    queryKey: ["timeOffQuotas"],
    queryFn: () => fetchTimeOffQuota(),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

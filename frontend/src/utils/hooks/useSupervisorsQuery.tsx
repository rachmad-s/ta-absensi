import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { minutes } from "../utils";
import { fetchSupervisorList } from "../api/supervisor.api";

export const useSupervisorListQuery = () => {
  return useQuery({
    queryKey: ["supervisors"],
    queryFn: () => fetchSupervisorList(),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

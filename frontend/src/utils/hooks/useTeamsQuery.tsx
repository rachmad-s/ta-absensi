import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { FetchTeamsListParams, fetchTeamsList } from "../api/teams.api";
import { minutes } from "../utils";

export const useTeamsListQuery = (
  queries?: FetchTeamsListParams,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: ["teams", queries?.name, queries?.departmentId],
    queryFn: () => fetchTeamsList({ ...queries }),
    staleTime: minutes(30),
    enabled: enabled !== undefined ? enabled : true,
    placeholderData: keepPreviousData,
  });
};

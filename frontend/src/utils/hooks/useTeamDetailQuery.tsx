import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTeamDetailById } from "../api/teams.api";
import { minutes } from "../utils";

export const useTeamDetailByIdQuery = (teamId: string) => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => fetchTeamDetailById(teamId),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

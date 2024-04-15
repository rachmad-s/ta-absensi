import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FetchUsersParam, fetchUsers } from "../api/users.api";
import { DEFAULT_TAKE } from "../constant";
import { minutes } from "../utils";

export const useUserQuery = (queries: FetchUsersParam) => {
  return useQuery({
    queryKey: [
      "users",
      queries.filter,
      queries.department,
      queries.team,
      queries.role,
      queries.skip || "0",
      queries.take || DEFAULT_TAKE,
    ],
    queryFn: () =>
      fetchUsers({
        ...queries,
        skip: queries.skip || "0",
        take: queries.take || String(DEFAULT_TAKE),
      }),
    staleTime: minutes(20),
    placeholderData: keepPreviousData,
  });
};

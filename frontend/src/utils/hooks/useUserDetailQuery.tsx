import { useQuery } from "@tanstack/react-query";
import { FetchUserDetailParam, fetchUserDetail } from "../api/users.api";

export const useUserDetailQuery = (queries: FetchUserDetailParam) => {
  return useQuery({
    queryKey: ["user", queries.id],
    queryFn: () =>
      fetchUserDetail({
        ...queries,
      }),
    staleTime: 0,
  });
};

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  FetchDepartmentsListParam,
  fetchDepartmentsList,
} from "../api/departments.api";
import { minutes } from "../utils";

export const useDepartmentsListQuery = (
  queries?: FetchDepartmentsListParam
) => {
  return useQuery({
    queryKey: ["departments", queries?.name],
    queryFn: () => fetchDepartmentsList({ ...queries }),
    staleTime: minutes(30),
    placeholderData: keepPreviousData,
  });
};

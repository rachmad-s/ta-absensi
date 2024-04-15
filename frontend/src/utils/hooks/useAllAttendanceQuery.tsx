import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FetchAllAttendancesParams, fetchAllAttendances } from "../api/attendance.api";
import { minutes } from "../utils";

export const useAllAttendanceQuery = (queries?: FetchAllAttendancesParams) => {
    return useQuery({
        queryKey: ["rawAttendance", { ...queries }],
        queryFn: () => fetchAllAttendances({ ...queries }),
        staleTime: minutes(5),
        placeholderData: keepPreviousData,
    });
};

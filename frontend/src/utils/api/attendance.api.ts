import { AxiosError } from "axios";

import { request } from "../axiosInstance";
import {
  AllAttendanceResponse,
  Attendance,
  MinimumAttendance,
  MonthlyAttendanceResponse,
  TeamAttendanceResponse,
} from "../models/attendance.model";
import { ResponseWithPagination } from "../types";

export interface AttendanceByMonthYear {
  month?: string;
  year?: string;
}

export interface FetchUserAttendanceByMonth extends AttendanceByMonthYear {
  userId?: string;
}

export interface FetchAllAttendanceByDate extends AttendanceByMonthYear {
  date?: string;
}

export interface FetchTeamAttendanceByMonth extends AttendanceByMonthYear {
  teamId?: string;
}

export interface FetchEmployeesAttendance extends AttendanceByMonthYear {
  department?: string;
  team?: string;
  search?: string;
  skip?: string;
  take?: string;
}

export interface CreateAttendancePayload {
  type: "IN" | "OUT";
  photoUrl: string;
  status: "APPROVED" | "REJECTED" | "WAITING",
  similarity: number;
}

export interface UpdateAttendancePayload {
  remarks: string;
  status: "APPROVED" | "REJECTED" | "WAITING"
  id: string;
}

export interface FetchAllAttendancesParams extends Partial<Attendance> {
  wihtoutMe?: boolean;
  month?: string;
  year?: string;
  departmentId?: string;
  teamId?: string;
}

const ROUTE = `${process.env.REACT_APP_BASE_API}/attendance`;

export const createAttendance = async (
  payload: CreateAttendancePayload
) => {
  try {
    const response = await request.post<Attendance>(
      `${ROUTE}/`, {
      type: payload.type,
      photoUrl: payload.photoUrl,
      status: payload.status,
      similarity: payload.similarity
    });
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const updateAttendance = async (
  payload: UpdateAttendancePayload
) => {
  try {
    const response = await request.put<Attendance>(
      `${ROUTE}/${payload.id}`, {
      remarks: payload.remarks,
      status: payload.status,
    });
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const fetchUserAttendanceByMonth = async (
  params: FetchUserAttendanceByMonth
) => {
  try {
    const month = params.month ? String(Number(params.month) + 1) : undefined;
    const response = await request.get<MonthlyAttendanceResponse>(
      `${ROUTE}/user/${params.userId}/${params.year}/${month}`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const fetchAttendanceByDate = async (
  params: FetchAllAttendanceByDate
) => {
  try {
    const month = params.month ? String(Number(params.month) + 1) : undefined;
    const response = await request.get<Attendance[]>(
      `${ROUTE}/all/${params.year}/${month}/${params.date}`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const fetchTeamAttendanceByMonth = async (
  params: FetchTeamAttendanceByMonth
) => {
  try {
    const month = params.month ? String(Number(params.month) + 1) : undefined;
    const response = await request.get<TeamAttendanceResponse[]>(
      `${ROUTE}/team/${params.teamId}/${params.year}/${month}`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const fetchMinimumAttendance = async (params: AttendanceByMonthYear) => {
  try {
    const month = params.month ? String(Number(params.month) + 1) : undefined;
    const response = await request.get<MinimumAttendance>(
      `${ROUTE}/minimum/${params.year}/${month}`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const fetchEmployeesAttendance = async (params: FetchEmployeesAttendance) => {
  try {
    const month = params.month ? String(Number(params.month) + 1) : undefined;
    const response = await request.get<
      ResponseWithPagination<AllAttendanceResponse[]>
    >(`${ROUTE}/${params.year}/${month}`, {
      params: {
        department: params.department,
        team: params.team,
        search: params.search,
        skip: params.skip,
        take: params.take,
      },
    });
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};


export const fetchAllAttendances = async (params: FetchAllAttendancesParams) => {
  try {
    const month = params.month ? String(Number(params.month) + 1) : undefined;
    const response = await request.get<
      Attendance[]
    >(`${ROUTE}`, {
      params: {
        departmentId: params.departmentId,
        teamId: params.teamId,
        status: params.status,
        userId: params.userId,
        type: params.type,
        month: params.month,
        year: params.year,
      },
    });
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

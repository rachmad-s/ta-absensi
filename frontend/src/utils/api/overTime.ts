import { AxiosError } from "axios";

import { request } from "../axiosInstance";
import { OverTime } from "../models/overTime.model";
import { TimeOff } from "../models/timeOff.model";
import { User } from "../models/user.model";
export interface RequestOverTimePayload {
  message?: string;
  date: string;
  duration: number;
}

export interface UpdateOverTimePayload extends RequestOverTimePayload {
  id: string;
}

export interface FetchOverTimeParams {
  userId?: string;
  departmentId?: string;
  teamId?: string;
  subordinate?: boolean;
  year?: string;
  month?: string;
  search?: string;
  withoutMe?: boolean;
}

export interface OverTimeSettled {
  status: string;
  remarks: string;
  user: User;
  overTimeRequest: OverTime;
}

export interface OverTimeSettlement {
  id: string;
  status: string;
  remarks?: string;
}

export const requestOverTime = async (payload: RequestOverTimePayload) => {
  try {
    const response = await request.post<OverTime>(
      `${process.env.REACT_APP_BASE_API}/over-time/request`,
      {
        message: payload.message,
        duration: payload.duration,
        date: payload.date,
      }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const updateOverTime = async (payload: UpdateOverTimePayload) => {
  try {
    const response = await request.put<TimeOff>(
      `${process.env.REACT_APP_BASE_API}/over-time/${payload.id}/update`,
      {
        ...payload,
      }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const fetchOverTime = async (params: FetchOverTimeParams) => {
  try {
    const response = await request.get<OverTime[]>(
      `${process.env.REACT_APP_BASE_API}/over-time`,
      {
        params,
      }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const settleOverTime = async (payload: OverTimeSettlement) => {
  try {
    const response = await request.post<OverTimeSettled>(
      `${process.env.REACT_APP_BASE_API}/over-time/${payload.id}/settle`,
      {
        remarks: payload.remarks,
        status: payload.status,
      }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

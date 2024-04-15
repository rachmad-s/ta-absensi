import { AxiosError } from "axios";

import { request } from "../axiosInstance";
import { TimeOff } from "../models/timeOff.model";

export interface RequestTimeOffPayload {
  attachment?: string;
  type?: string;
  message?: string;
  days?: string;
  startDate?: string | Date;
}

export interface UpdateTimeOffPayload extends RequestTimeOffPayload {
  id: string;
}

export interface FetchTimeOffParams {
  userId?: string;
  departmentId?: string;
  teamId?: string;
  subordinate?: boolean;
  year?: string;
  type?: string;
  status?: string;
  month?: string;
  search?: string;
  withoutMe?: boolean;
}

export interface TimeOffQuota {
  name: string;
  label: string;
  per: string;
  quota: string;
  duration: string;
  quotaLeft: number;
}

export interface TimeOffSettlement {
  id: string;
  status: string;
  remarks?: string;
}

export const requestTimeOff = async (payload: RequestTimeOffPayload) => {
  try {
    const response = await request.post<TimeOff>(
      `${process.env.REACT_APP_BASE_API}/time-off/request`,
      {
        type: payload.type,
        startDate: payload.startDate,
        days: Number(payload.days),
        message: payload.message,
        attachment: payload.attachment,
      }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const updateTimeOff = async (payload: UpdateTimeOffPayload) => {
  try {
    const response = await request.put<TimeOff>(
      `${process.env.REACT_APP_BASE_API}/time-off/${payload.id}/update`,
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

export const fetchTimeOff = async (params: FetchTimeOffParams) => {
  try {
    const response = await request.get<TimeOff[]>(
      `${process.env.REACT_APP_BASE_API}/time-off`,
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

export const fetchTimeOffQuota = async () => {
  try {
    const response = await request.get<TimeOffQuota[]>(
      `${process.env.REACT_APP_BASE_API}/time-off/quota`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const settleTimeOff = async (payload: TimeOffSettlement) => {
  try {
    const response = await request.post<TimeOffQuota[]>(
      `${process.env.REACT_APP_BASE_API}/time-off/${payload.id}/settle`,
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

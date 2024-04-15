import { AxiosError } from "axios";

import { request } from "../axiosInstance";
import { PublicHoliday } from "../models/publicHoliday.model";

export interface FetchPublicHolidayListParam {
  name?: string;
  year?: string;
  month?: string;
}

export const fetchPublicHolidayList = async (
  params: FetchPublicHolidayListParam
) => {
  try {
    const response = await request.get<PublicHoliday[]>(
      `${process.env.REACT_APP_BASE_API}/public-holiday`,
      { params }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const createPublicHoliday = async (params: Partial<PublicHoliday>) => {
  try {
    const response = await request.post<PublicHoliday>(
      `${process.env.REACT_APP_BASE_API}/public-holiday`,
      { name: params.name, date: params.date }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const updatePublicHoliday = async (params: Partial<PublicHoliday>) => {
  try {
    const response = await request.put<PublicHoliday>(
      `${process.env.REACT_APP_BASE_API}/public-holiday/${params.id}`,
      { name: params.name, date: params.date }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const deletePublicHoliday = async (params: Partial<PublicHoliday>) => {
  try {
    const response = await request.delete<PublicHoliday>(
      `${process.env.REACT_APP_BASE_API}/public-holiday/${params.id}`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

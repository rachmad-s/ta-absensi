import { AxiosError } from "axios";

import { request } from "../axiosInstance";
import { Department } from "../models/department.model";

export interface FetchDepartmentsListParam {
  name?: string;
}

export const fetchDepartmentsList = async (
  params: FetchDepartmentsListParam
) => {
  try {
    const response = await request.get<Department[]>(
      `${process.env.REACT_APP_BASE_API}/department`,
      { params }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const createDepartment = async (params: Partial<Department>) => {
  try {
    const response = await request.post<Department>(
      `${process.env.REACT_APP_BASE_API}/department`,
      { name: params.name }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const updateDepartment = async (params: Partial<Department>) => {
  try {
    const response = await request.put<Department>(
      `${process.env.REACT_APP_BASE_API}/department/${params.id}`,
      { name: params.name }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const deleteDepartment = async (params: Partial<Department>) => {
  try {
    const response = await request.delete<Department>(
      `${process.env.REACT_APP_BASE_API}/department/${params.id}`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

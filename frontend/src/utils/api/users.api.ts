import { AxiosError, AxiosResponse } from "axios";

import { request } from "../axiosInstance";
import { User } from "../models/user.model";
import { ResponseWithPagination } from "../types";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  position: string;
  role: string;
  team: string;
  address: string;
  supervisorId: string;
  level: number;
}

export interface EditUserPayload extends Omit<CreateUserPayload, "password"> {
  userId: string;
  avatarUrl?: string;
}

export interface CreateUserResponse {
  name: string;
  email: string;
  password: string;
  position: string;
  role: string;
  team: string;
  address: string;
  supervisedBy: string;
}

export interface FetchUsersParam {
  filter?: string | null;
  role?: string | null;
  department?: string | null;
  team?: string | null;
  skip?: string | null;
  take?: string | null;
}

export interface FetchUserDetailParam {
  id: string;
}

export const fetchUsers = async ({
  ...params
}: FetchUsersParam | undefined) => {
  try {
    const response = await request.get<ResponseWithPagination<User[]>>(
      `${process.env.REACT_APP_BASE_API}/user?sort=email&direction=asc`,
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

export const fetchUserDetail = async (param: FetchUserDetailParam) => {
  try {
    const response = await request.get<User>(
      `${process.env.REACT_APP_BASE_API}/user/${param.id}`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const createUser = async (payload: CreateUserPayload) => {
  try {
    const response = await request.post<
      CreateUserResponse,
      AxiosResponse<CreateUserResponse>
    >(`${process.env.REACT_APP_BASE_API}/user/`, { ...payload });
    return response;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await request.delete<
      CreateUserResponse,
      AxiosResponse<CreateUserResponse>
    >(`${process.env.REACT_APP_BASE_API}/user/${userId}`);
    return response;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const updateUser = async (payload: Partial<EditUserPayload>) => {
  try {
    const response = await request.put<User, AxiosResponse<User>>(
      `${process.env.REACT_APP_BASE_API}/user/${payload.userId}`,
      { ...payload }
    );
    return response;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

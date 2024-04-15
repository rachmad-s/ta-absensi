import { AxiosError, AxiosResponse } from "axios";
import { request } from "../axiosInstance";
import { User } from "../models/user.model";

export interface LoginPayload extends Pick<User, "email"> {
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const login = async (payload: LoginPayload) => {
  try {
    const login = await request.post<
      LoginResponse,
      AxiosResponse<LoginResponse>,
      LoginPayload
    >(`${process.env.REACT_APP_BASE_API}/auth/login`, {
      email: payload.email,
      password: payload.password,
    });
    return login.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

import { AxiosError } from "axios";

import { request } from "../axiosInstance";
import { Supervisor } from "../models/supervisor.model";

export const fetchSupervisorList = async () => {
  try {
    const response = await request.get<Supervisor[]>(
      `${process.env.REACT_APP_BASE_API}/supervisor`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    if (error.response?.status === 401) {
      localStorage.removeItem("authentication");
    }
    throw error.response?.data;
  }
};

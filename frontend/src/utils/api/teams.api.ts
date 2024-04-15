import { AxiosError } from "axios";

import { request } from "../axiosInstance";
import { Team } from "../models/team.model";

export interface FetchTeamsListParams {
  name?: string;
  departmentId?: string;
}

export const fetchTeamsList = async (params: FetchTeamsListParams) => {
  try {
    const response = await request.get<Team[]>(
      `${process.env.REACT_APP_BASE_API}/team`,
      { params }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const fetchTeamDetailById = async (teamId: string) => {
  try {
    const response = await request.get<Team>(
      `${process.env.REACT_APP_BASE_API}/team/${teamId}`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const createTeam = async (params: Partial<Team>) => {
  try {
    const response = await request.post<Team>(
      `${process.env.REACT_APP_BASE_API}/team`,
      { name: params.name, departmentId: params.departmentId }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const updateTeam = async (params: Partial<Team>) => {
  try {
    const response = await request.put<Team>(
      `${process.env.REACT_APP_BASE_API}/team/${params.id}`,
      { name: params.name, departmentId: params.departmentId }
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

export const deleteTeam = async (params: Partial<Team>) => {
  try {
    const response = await request.delete<Team>(
      `${process.env.REACT_APP_BASE_API}/team/${params.id}`
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response?.data;
  }
};

import { Profile } from "./profile.mode";
import { User } from "./user.model";

export interface AllAttendanceResponse extends User {
  attendance: MonthlyAttendanceResponse;
}

export interface TeamAttendanceResponse extends Profile {
  attendance: MonthlyAttendanceResponse;
}

export interface MinimumAttendance {
  workDays: number;
  totalWorkMinutes: number;
}

export interface MonthlyAttendanceResponse {
  period: {
    start: string;
    end: string;
  }
  minimumWorkDays: number;
  minimumWorkMinutes: number;
  totalAttendDays: number;
  totalMinutes: number;
  totalLates: number;
  averageWorkMinutes: number;
  data: MonthlyAttendance[];
}

export interface MonthlyAttendance {
  date: string;
  day: number;
  totalWorkMinute?: number;
  isPublicHoliday: boolean;
  isUserTimeOff: boolean;
  attendance: AttendanceType;
}

export interface Attendance {
  id: string,
  date: string,
  photoUrl: string,
  type: string,
  status: "APPROVED" | "REJECTED" | "WAITING";
  userId: string,
  user: User;
  similarity: number;
  remarks?: string | null,
}

export interface AttendanceType {
  in?: In;
  out?: Out;
}

export interface In {
  date: string;
  photoUrl: string;
  type: string;
  id: string;
  similarity: number;
  status: "APPROVED" | "REJECTED" | "WAITING";
  remarks: string;
}

export interface Out {
  date: string;
  photoUrl: string;
  similarity: number;
  type: string;
  id: string;
  status: "APPROVED" | "REJECTED" | "WAITING";
  remarks: string;
}

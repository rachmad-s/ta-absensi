import { RequestAction } from "./RequestAction";
import { User } from "./user.model";

export interface OverTime {
  id: string;
  message?: string;
  date: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
  requestActions?: RequestAction[];
}

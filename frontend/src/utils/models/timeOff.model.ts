import { RequestAction } from "./RequestAction";
import { User } from "./user.model";

export interface TimeOff {
  id: string;
  message?: string;
  attachment?: string;
  type: string;
  days: number;
  startDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  requestActions?: RequestAction[];
  user: User;
}

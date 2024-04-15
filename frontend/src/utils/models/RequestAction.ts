import { User } from "./user.model";

export interface RequestAction {
  id: string;
  status: string;
  timeOffRequestId?: string | null;
  overTimeRequestId?: string | null;
  remarks?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

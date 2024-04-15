import { Profile } from "./profile.mode";

export type Roles = "ADMIN" | "USER" | "HR";
export interface User {
  id: string;
  email: string;
  role: Roles;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
  supervisor?: User;
  supervising?: User[];
}

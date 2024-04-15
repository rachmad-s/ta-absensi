import { Team } from "./team.model";

export interface Profile {
  id: string;
  name: string;
  address?: string;
  level?: number;
  avatarUrl?: string;
  position?: string;
  createdAt: string;
  dob: string;
  updatedAt: string;
  teamId?: string;
  userId?: string;
  team?: Team;
}

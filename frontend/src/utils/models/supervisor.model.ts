import { Profile } from "./profile.mode";

export interface Supervisor {
  id: string;
  email: string;
  role: string;
  profile?: Partial<Profile>;
}

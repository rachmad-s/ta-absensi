import { Department } from "./department.model";
import { Profile } from "./profile.mode";

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  departmentId: string;
  department: Department;
  totalEmployees: number;
  profiles: Profile[];
}

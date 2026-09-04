import type { UserRole } from "@user/user.enum";

export interface User {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string | null;
  password: string;
  created_at: string;
  updated_at: string;
}

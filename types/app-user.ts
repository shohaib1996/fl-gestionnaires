import type { UserRole } from "./role";
export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string | null;
  avatarURL?: string | null;
}

import { User } from "firebase/auth";
import { useAuthContext } from "./auth-context";
import { auth } from "./firebase";

export type Role = "citizen" | "municipality" | "admin";

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  points: number;
}

export interface AuthState {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  role: Role;
}

export function useAuth(): AuthState {
  return useAuthContext();
}

export async function signOut() {
  await auth.signOut();
}

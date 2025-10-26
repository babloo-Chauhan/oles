import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  // Currently the app persists auth in localStorage. This hook exposes
  // a small consistent API that can be upgraded later to use context state.
  const ctx = useContext(AuthContext);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  return {
    ...ctx,
    token,
    user: username ? { username, role } : null,
    role,
  };
}

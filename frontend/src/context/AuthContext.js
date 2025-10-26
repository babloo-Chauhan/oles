import { createContext } from "react";

// Lightweight AuthContext used by useAuth hook and ProtectedRoute
// The app currently stores token/username/role in localStorage, so
// this context can be used for future expansions. For now we export
// a simple context with null default.
export const AuthContext = createContext(null);

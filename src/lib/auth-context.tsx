import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import { AuthState, Profile, Role } from "./auth";

const AuthContext = createContext<AuthState>({
  loading: true,
  user: null,
  profile: null,
  role: "citizen",
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    loading: true,
    user: null,
    profile: null,
    role: "citizen",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Mock profile and role based on standard Firebase user info
        const profile: Profile = {
          id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || null,
          email: user.email,
          avatar_url: user.photoURL,
          points: 0,
        };
        // By default, assuming all authenticated users are citizens unless managed by claims
        const role: Role = "citizen";
        setState({ loading: false, user, profile, role });
      } else {
        setState({ loading: false, user: null, profile: null, role: "citizen" });
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

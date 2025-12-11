"use client";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

// -----------------------------
// Types
// -----------------------------
interface UserContextType {
  user: User | null;
  loading: boolean;
}

interface UserProviderProps {
  initialUser: User | null;
  children: React.ReactNode;
}

// -----------------------------
// Context
// -----------------------------
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

// -----------------------------
// Provider
// -----------------------------
export function UserProvider({ children, initialUser }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    const supabase = createClient();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// -----------------------------
// Hook
// -----------------------------
export function useUser() {
  return useContext(UserContext);
}

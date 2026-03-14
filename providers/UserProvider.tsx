"use client";

import { createClient } from "@/lib/supabase/client";
import { AppUser } from "@/types/app-user";
import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  authUser: User | null;
  user: AppUser | null;
  loading: boolean;
}

interface UserProviderProps {
  initialAuthUser: User | null;
  children: React.ReactNode;
}

const UserContext = createContext<UserContextType>({
  authUser: null,
  user: null,
  loading: true,
});

export function UserProvider({ children, initialAuthUser }: UserProviderProps) {
  const supabase = createClient();

  const [authUser, setAuthUser] = useState<User | null>(initialAuthUser);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPublicUser = async (uid: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, fullName")
      .eq("id", uid)
      .single();

    if (error) {
      console.error("Failed to fetch public user:", error);
      setUser(null);
      return;
    }

    setUser(data);
  };

  useEffect(() => {
    // If we already have a user from the server, fetch their profile immediately
    // instead of waiting for onAuthStateChange to fire
    if (initialAuthUser) {
      fetchPublicUser(initialAuthUser.id).finally(() => setLoading(false));
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const nextAuthUser = session?.user ?? null;
        setAuthUser(nextAuthUser);

        if (nextAuthUser) {
          await fetchPublicUser(nextAuthUser.id);
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ authUser, user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

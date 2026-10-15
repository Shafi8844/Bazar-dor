"use client";

import { createContext, useContext, useMemo } from "react";
import { authClient } from "@/lib/auth-client";

type AuthUser = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  socialSignIn: (provider: "Google" | "GitHub") => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const value = useMemo<AuthContextValue>(
    () => {
      const user = session?.user
        ? { name: session.user.name, email: session.user.email }
        : null;

      return {
        user,
        ready: !isPending,
        async signIn(email, password) {
          const result = await authClient.signIn.email({ email, password });
          if (result.error) throw new Error(result.error.message || "সাইন ইন করা যায়নি।");
        },
        async signUp(name, email, password) {
          const result = await authClient.signUp.email({ name, email, password });
          if (result.error) throw new Error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        },
        async socialSignIn(provider) {
          const result = await authClient.signIn.social({
            provider: provider === "Google" ? "google" : "github",
          });
          if (result.error) throw new Error(result.error.message || "সোশ্যাল সাইন ইন করা যায়নি।");
        },
        async signOut() {
          const result = await authClient.signOut();
          if (result.error) throw new Error(result.error.message || "সাইন আউট করা যায়নি।");
        },
      };
    },
    [isPending, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

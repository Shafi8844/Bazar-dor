"use client";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}

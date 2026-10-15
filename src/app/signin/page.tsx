import { AuthForm } from "@/components/auth-form";

export const instant = false;

export default function SignInPage() {
  return <AuthForm mode="signin" />;
}

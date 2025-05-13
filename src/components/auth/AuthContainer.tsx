import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { SetNewPasswordForm } from "./SetNewPasswordForm";

type AuthView = "login" | "register" | "reset" | "set-password";

interface ViewConfig {
  title: string;
  description: string;
}

const viewConfigs: Record<AuthView, ViewConfig> = {
  login: {
    title: "Welcome Back",
    description: "Sign in to your account to continue",
  },
  register: {
    title: "Create Account",
    description: "Sign up for a new account to get started",
  },
  reset: {
    title: "Reset Password",
    description: "Enter your email to receive a password reset link",
  },
  "set-password": {
    title: "Set New Password",
    description: "Enter your new password to continue",
  },
};

export function AuthContainer() {
  const [view, setView] = useState<AuthView>("login");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Will be handled by Supabase integration
    console.log("Login:", email, password);
  };

  const handleRegister = (email: string, password: string) => {
    // Will be handled by Supabase integration
    console.log("Register:", email, password);
  };

  const handleResetRequest = (email: string) => {
    // Will be handled by Supabase integration
    console.log("Reset request:", email);
  };

  const handleSetNewPassword = (password: string) => {
    // Will be handled by Supabase integration
    console.log("Set new password:", password, resetToken);
  };

  const currentView = viewConfigs[view];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">{currentView.title}</h2>
        <p className="text-muted-foreground">{currentView.description}</p>
      </div>

      {view === "login" && (
        <>
          <LoginForm onSubmit={handleLogin} onForgotPassword={() => setView("reset")} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button onClick={() => setView("register")} className="text-primary hover:underline">
              Create one
            </button>
          </p>
        </>
      )}

      {view === "register" && (
        <>
          <RegisterForm onSubmit={handleRegister} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={() => setView("login")} className="text-primary hover:underline">
              Sign in
            </button>
          </p>
        </>
      )}

      {view === "reset" && <ResetPasswordForm onSubmit={handleResetRequest} onBack={() => setView("login")} />}

      {view === "set-password" && resetToken && <SetNewPasswordForm onSubmit={handleSetNewPassword} />}
    </div>
  );
}

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { SetNewPasswordForm } from "./SetNewPasswordForm";

type AuthView = "login" | "register" | "reset-password" | "set-password";

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
  "reset-password": {
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
  const [resetToken] = useState<string | null>(null);

  const handleViewChange = (newView: AuthView) => {
    setView(newView);
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
          <LoginForm
            onRegisterClick={() => handleViewChange("register")}
            onForgotPasswordClick={() => handleViewChange("reset-password")}
          />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button onClick={() => handleViewChange("register")} className="text-primary hover:underline">
              Create one
            </button>
          </p>
        </>
      )}

      {view === "register" && (
        <>
          <RegisterForm onLoginClick={() => handleViewChange("login")} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={() => handleViewChange("login")} className="text-primary hover:underline">
              Sign in
            </button>
          </p>
        </>
      )}

      {view === "reset-password" && <ResetPasswordForm onBackToLogin={() => handleViewChange("login")} />}

      {view === "set-password" && resetToken && <SetNewPasswordForm onSubmit={handleSetNewPassword} />}
    </div>
  );
}

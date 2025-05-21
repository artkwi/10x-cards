import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LoginForm } from "./../LoginForm";
import { AuthContainer } from "./../AuthContainer";

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm onRegisterClick={vi.fn()} onForgotPasswordClick={vi.fn()} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("calls onRegisterClick when register button is clicked", () => {
    const onRegisterClick = vi.fn();
    render(<LoginForm onRegisterClick={onRegisterClick} onForgotPasswordClick={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(onRegisterClick).toHaveBeenCalled();
  });

  it("calls onForgotPasswordClick when forgot password is clicked", () => {
    const onForgotPasswordClick = vi.fn();
    render(<LoginForm onRegisterClick={vi.fn()} onForgotPasswordClick={onForgotPasswordClick} />);
    fireEvent.click(screen.getByRole("button", { name: /forgot your password/i }));
    expect(onForgotPasswordClick).toHaveBeenCalled();
  });

  it("shows error on invalid credentials (API error)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });
    render(<LoginForm onRegisterClick={vi.fn()} onForgotPasswordClick={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("redirects on successful login", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    delete window.location;
    window.location = { href: "" } as any;
    render(<LoginForm onRegisterClick={vi.fn()} onForgotPasswordClick={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "correctpass" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await screen.findByRole("button", { name: /login/i });
    expect(window.location.href).toBe("/");
  });
});

describe("AuthContainer", () => {
  it("shows login view by default", () => {
    render(<AuthContainer />);
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
  });

  it("switches to register view on click", () => {
    render(<AuthContainer />);
    fireEvent.click(screen.getByText(/create one/i));
    expect(screen.getByText(/sign up for a new account/i)).toBeInTheDocument();
  });
});

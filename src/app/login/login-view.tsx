"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AccountView } from "@/app/account/account-view";
import { ADDRESSES_QUERY_KEY } from "@/lib/address-hooks";
import {
  requestPasswordReset,
  resetPassword,
  startLogin,
  verifyLogin,
} from "@/lib/api-client";
import { AUTH_QUERY_KEY, useAuth } from "@/lib/auth";
import type {
  LoginStartInput,
  PasswordForgotInput,
  PasswordResetInput,
} from "@/lib/types";

function normalizeErrorMessage(message: string): string {
  const trimmed = message.trim();

  const keyMatch = trimmed.match(/^Key: '[^']+' Error:(.*)$/);
  const base = keyMatch ? keyMatch[1].trim() : trimmed;

  const validationMatch = base.match(
    /Field validation for '(.+?)' failed on the '(.+?)' tag/i,
  );
  if (validationMatch) {
    const fieldLabel = validationMatch[1];
    const rule = validationMatch[2].toLowerCase();
    const fieldKey = fieldLabel.toLowerCase();

    if (fieldKey === "password" && rule === "min") {
      return "Password must meet the minimum length requirement.";
    }
    if (rule === "required") {
      return `${fieldLabel} is required.`;
    }
    return `${fieldLabel} failed validation (${rule}).`;
  }

  return base;
}

type AuthMode = "login" | "signup" | "forgot";
type LoginStep = "credentials" | "otp";
type ForgotStep = "request" | "reset";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const authQuery = useAuth();

  const redirectTarget = useMemo(() => {
    const next = searchParams.get("next");
    if (next?.startsWith("/") && !next?.startsWith("//")) {
      return next;
    }
    return "/";
  }, [searchParams]);

  const modeParam = searchParams.get("mode");
  const initialMode: AuthMode = modeParam === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginStep, setLoginStep] = useState<LoginStep>("credentials");
  const [loginForm, setLoginForm] = useState<LoginStartInput>({
    mobile: "",
    password: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("request");
  const [forgotForm, setForgotForm] = useState<PasswordResetInput>({
    email: "",
    mobile: "",
    code: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const startLoginMutation = useMutation({
    mutationFn: startLogin,
    onSuccess: () => {
      setLoginStep("otp");
      setLoginMessage("Enter the verification code sent to your mobile.");
    },
  });

  const verifyLoginMutation = useMutation({
    mutationFn: verifyLogin,
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY }).catch(() => {
        // noop
      });
      queryClient
        .invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY })
        .catch(() => {
          // addresses will refetch on demand
        });
      router.push(redirectTarget);
    },
  });

  const forgotMutation = useMutation({
    mutationFn: (input: PasswordForgotInput) => requestPasswordReset(input),
    onSuccess: () => {
      setForgotStep("reset");
      setLoginMessage(
        "Enter the code from the logs and choose a new password.",
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (input: PasswordResetInput) => resetPassword(input),
    onSuccess: () => {
      setMode("login");
      resetLoginFlows();
      setForgotStep("request");
      setForgotForm({ email: "", mobile: "", code: "", password: "" });
      setLoginForm((current) => ({ ...current, password: "" }));
      setConfirmPassword("");
      setLoginMessage("Password updated. Sign in with your new password.");
    },
  });

  const resetLoginFlows = useCallback(() => {
    setLoginStep("credentials");
    setOtpCode("");
    setLoginMessage(null);
    startLoginMutation.reset();
    verifyLoginMutation.reset();
  }, [startLoginMutation, verifyLoginMutation]);

  const handleActivationComplete = useCallback(
    (mobile: string) => {
      setMode("login");
      resetLoginFlows();
      setForgotStep("request");
      setLoginForm({ mobile, password: "" });
      setLoginMessage("Account activated. Enter your password to sign in.");
    },
    [resetLoginFlows],
  );

  useEffect(() => {
    if (modeParam === "signup") {
      setMode("signup");
      resetLoginFlows();
      setForgotStep("request");
      setForgotForm({ email: "", mobile: "", code: "", password: "" });
      setConfirmPassword("");
      forgotMutation.reset();
      resetPasswordMutation.reset();
      setLoginMessage(null);
      return;
    }

    if (modeParam === "login") {
      setMode("login");
      resetLoginFlows();
      setForgotStep("request");
      setForgotForm({ email: "", mobile: "", code: "", password: "" });
      setConfirmPassword("");
      forgotMutation.reset();
      resetPasswordMutation.reset();
      setLoginMessage(null);
    }
  }, [modeParam, forgotMutation, resetLoginFlows, resetPasswordMutation]);

  useEffect(() => {
    if (!authQuery.isLoading && authQuery.data) {
      router.replace(redirectTarget);
    }
  }, [authQuery.data, authQuery.isLoading, redirectTarget, router]);

  const handleModeChange = useCallback(
    (nextMode: AuthMode) => {
      setMode(nextMode);
      if (nextMode === "login") {
        resetLoginFlows();
        setForgotStep("request");
        setForgotForm({ email: "", mobile: "", code: "", password: "" });
        setConfirmPassword("");
        forgotMutation.reset();
        resetPasswordMutation.reset();
        setLoginMessage(null);
      } else if (nextMode === "signup") {
        resetLoginFlows();
        setForgotStep("request");
        setForgotForm({ email: "", mobile: "", code: "", password: "" });
        setConfirmPassword("");
        forgotMutation.reset();
        resetPasswordMutation.reset();
        setLoginMessage(null);
      } else if (nextMode === "forgot") {
        resetLoginFlows();
        setForgotStep("request");
        setForgotForm({ email: "", mobile: "", code: "", password: "" });
        setConfirmPassword("");
        forgotMutation.reset();
        resetPasswordMutation.reset();
        setLoginMessage(null);
      }
    },
    [forgotMutation, resetLoginFlows, resetPasswordMutation],
  );

  const handleLoginChange =
    (field: keyof LoginStartInput) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (startLoginMutation.isSuccess || startLoginMutation.isError) {
        startLoginMutation.reset();
      }
      if (verifyLoginMutation.isSuccess || verifyLoginMutation.isError) {
        verifyLoginMutation.reset();
      }
      setLoginMessage(null);
      setLoginForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: LoginStartInput = {
      mobile: loginForm.mobile.trim(),
      password: loginForm.password,
    };
    startLoginMutation.mutate(payload);
  };

  const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyLoginMutation.mutate({
      mobile: loginForm.mobile.trim(),
      code: otpCode.trim(),
    });
  };

  const getMutationError = (mutation: { isError: boolean; error: unknown }) => {
    if (!mutation.isError || !mutation.error) {
      return null;
    }
    const { error } = mutation;
    if (error instanceof Error) {
      return normalizeErrorMessage(error.message);
    }
    if (
      typeof error === "object" &&
      error &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      return normalizeErrorMessage((error as { message: string }).message);
    }
    if (typeof error === "string") {
      return normalizeErrorMessage(error);
    }
    return "Something went wrong.";
  };

  const loginFormDisabled =
    startLoginMutation.isPending ||
    loginForm.mobile.trim() === "" ||
    loginForm.password === "";

  const otpFormDisabled =
    verifyLoginMutation.isPending ||
    otpCode.trim() === "" ||
    loginForm.mobile.trim() === "";

  const forgotRequestDisabled =
    forgotMutation.isPending ||
    forgotForm.email.trim() === "" ||
    forgotForm.mobile.trim() === "";

  const passwordsMatch = forgotForm.password === confirmPassword;

  const resetDisabled =
    resetPasswordMutation.isPending ||
    forgotForm.email.trim() === "" ||
    forgotForm.mobile.trim() === "" ||
    forgotForm.code.trim() === "" ||
    forgotForm.password === "" ||
    confirmPassword === "" ||
    !passwordsMatch;

  const startErrorMessage = getMutationError(startLoginMutation);
  const verifyErrorMessage = getMutationError(verifyLoginMutation);
  const forgotErrorMessage = getMutationError(forgotMutation);
  const resetErrorMessage = getMutationError(resetPasswordMutation);
  const showPasswordMismatch =
    forgotStep === "reset" &&
    confirmPassword !== "" &&
    forgotForm.password !== "" &&
    !passwordsMatch;

  if (authQuery.isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
        <p className="text-sm text-slate-300">Checking your session…</p>
      </div>
    );
  }

  if (!authQuery.isLoading && authQuery.data) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-center gap-10 px-6 py-12">
      <header className="space-y-3 text-center">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20 text-base font-semibold text-teal-200">
          CT
        </span>
        <h1 className="text-3xl font-semibold text-white">
          {mode === "login"
            ? "Secure operator access"
            : mode === "signup"
              ? "Create your operator access"
              : "Reset your password"}
        </h1>
        <p className="text-sm text-slate-300">
          {mode === "login"
            ? "Enter your mobile number and password to receive a one-time login code."
            : mode === "signup"
              ? "Provision a new operator account with name, email, mobile, and password."
              : "Request a reset code using your email and mobile, then choose a new password."}
        </p>
        {loginMessage ? (
          <p className="text-xs text-teal-200">{loginMessage}</p>
        ) : null}
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm text-slate-300">
          <button
            type="button"
            onClick={() => handleModeChange("login")}
            className={
              mode === "login"
                ? "flex-1 rounded-full bg-teal-500/20 px-4 py-2 font-semibold text-teal-100 shadow-[0_0_0_1px_rgba(45,212,191,0.35)]"
                : "flex-1 rounded-full px-4 py-2 font-semibold transition hover:text-white"
            }
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("signup")}
            className={
              mode === "signup"
                ? "flex-1 rounded-full bg-teal-500/20 px-4 py-2 font-semibold text-teal-100 shadow-[0_0_0_1px_rgba(45,212,191,0.35)]"
                : "flex-1 rounded-full px-4 py-2 font-semibold transition hover:text-white"
            }
          >
            Sign up
          </button>
        </div>

        {mode === "login" ? (
          <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
            {loginStep === "credentials" ? (
              <form className="space-y-6" onSubmit={handleLoginSubmit}>
                <div className="space-y-4">
                  <TextField
                    label="Mobile number"
                    type="tel"
                    value={loginForm.mobile}
                    onChange={handleLoginChange("mobile")}
                    autoComplete="tel"
                    placeholder="+15555550123"
                    required
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={loginForm.password}
                    onChange={handleLoginChange("password")}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginFormDisabled}
                  className="w-full rounded-full border border-white/10 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-teal-400/40 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                >
                  {startLoginMutation.isPending
                    ? "Sending code..."
                    : "Send login code"}
                </button>

                {startLoginMutation.isPending ? (
                  <p className="text-center text-xs text-teal-200">
                    Contacting the auth service…
                  </p>
                ) : null}

                {startErrorMessage ? (
                  <ErrorBanner message={startErrorMessage} />
                ) : null}
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleOtpSubmit}>
                <div className="space-y-4">
                  <TextField
                    label="One-time code"
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    required
                  />
                  <p className="text-xs text-slate-400">
                    Enter the code sent to
                    <span className="ml-1 font-semibold text-teal-200">
                      {loginForm.mobile}
                    </span>
                    . Codes are logged by the backend during development.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={otpFormDisabled}
                    className="rounded-full border border-white/10 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-teal-400/40 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                  >
                    {verifyLoginMutation.isPending
                      ? "Verifying..."
                      : "Verify code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginStep("credentials");
                      setOtpCode("");
                      verifyLoginMutation.reset();
                    }}
                    className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-white/10"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={forgotRequestDisabled}
                    onClick={() => handleModeChange("forgot")}
                    className="rounded-full bg-teal-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal-100 transition hover:bg-teal-500/30"
                  >
                    Forgot password?
                  </button>
                </div>

                {verifyErrorMessage ? (
                  <ErrorBanner message={verifyErrorMessage} />
                ) : null}
              </form>
            )}
          </section>
        ) : mode === "signup" ? (
          <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 sm:p-6">
            <AccountView onActivationComplete={handleActivationComplete} />
          </section>
        ) : (
          <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
            {forgotStep === "request" ? (
              <form
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  const payload: PasswordForgotInput = {
                    email: forgotForm.email.trim(),
                    mobile: forgotForm.mobile.trim(),
                  };
                  forgotMutation.mutate(payload);
                }}
              >
                <div className="space-y-4">
                  <TextField
                    label="Email"
                    type="email"
                    value={forgotForm.email}
                    onChange={(event) =>
                      setForgotForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="operator@example.com"
                    required
                  />
                  <TextField
                    label="Mobile number"
                    type="tel"
                    value={forgotForm.mobile}
                    onChange={(event) =>
                      setForgotForm((current) => ({
                        ...current,
                        mobile: event.target.value,
                      }))
                    }
                    placeholder="+15555550123"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotRequestDisabled}
                  className="w-full rounded-full border border-white/10 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-teal-400/40 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                >
                  {forgotMutation.isPending
                    ? "Sending code..."
                    : "Send reset code"}
                </button>
                {forgotErrorMessage ? (
                  <ErrorBanner message={forgotErrorMessage} />
                ) : null}
              </form>
            ) : (
              <form
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!passwordsMatch) {
                    return;
                  }
                  const payload: PasswordResetInput = {
                    email: forgotForm.email.trim(),
                    mobile: forgotForm.mobile.trim(),
                    code: forgotForm.code.trim(),
                    password: forgotForm.password,
                  };
                  resetPasswordMutation.mutate(payload);
                }}
              >
                <div className="space-y-4">
                  <TextField
                    label="Verification code"
                    value={forgotForm.code}
                    onChange={(event) =>
                      setForgotForm((current) => ({
                        ...current,
                        code: event.target.value,
                      }))
                    }
                    inputMode="numeric"
                    placeholder="123456"
                    required
                  />
                  <TextField
                    label="New password"
                    type="password"
                    value={forgotForm.password}
                    onChange={(event) =>
                      setForgotForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    autoComplete="new-password"
                    required
                  />
                  <TextField
                    label="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetDisabled}
                  className="w-full rounded-full border border-white/10 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-teal-400/40 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                >
                  {resetPasswordMutation.isPending
                    ? "Resetting..."
                    : "Reset password"}
                </button>
                {resetErrorMessage ? (
                  <ErrorBanner message={resetErrorMessage} />
                ) : null}
                {showPasswordMismatch ? (
                  <ErrorBanner message="Passwords do not match. Please try again." />
                ) : null}
              </form>
            )}
          </section>
        )}

        {mode === "login" ? (
          <p className="text-center text-xs text-slate-400">
            Need an account?{" "}
            <button
              type="button"
              onClick={() => handleModeChange("signup")}
              className="font-semibold text-teal-200 underline-offset-4 hover:underline"
            >
              Create one now
            </button>
            .{" "}
            <button
              type="button"
              onClick={() => handleModeChange("forgot")}
              className="font-semibold text-teal-200 underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
            .
          </p>
        ) : mode === "signup" ? (
          <p className="text-center text-xs text-slate-400">
            Already registered?{" "}
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className="font-semibold text-teal-200 underline-offset-4 hover:underline"
            >
              Return to sign in
            </button>
            .
          </p>
        ) : (
          <p className="text-center text-xs text-slate-400">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className="font-semibold text-teal-200 underline-offset-4 hover:underline"
            >
              Back to sign in
            </button>
            .
          </p>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300">
      <span className="font-medium text-slate-100">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
      />
    </label>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
      {message}
    </div>
  );
}

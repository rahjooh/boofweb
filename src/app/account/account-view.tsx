"use client";

import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { activateUser, createUser } from "@/lib/api-client";
import type { ActivateUserInput, CreateUserInput, User } from "@/lib/types";

const examplePayload: CreateUserInput = {
  name: "Alice",
  email: "alice@example.com",
  mobile: "+15555550123",
  password: "Str0ngP@ssw0rd!",
};

interface AccountViewProps {
  onActivationComplete?: (mobile: string) => void;
}

type SignupStep = "form" | "otp" | "activated";

export function AccountView({ onActivationComplete }: AccountViewProps = {}) {
  const [form, setForm] = useState<CreateUserInput>({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [step, setStep] = useState<SignupStep>("form");
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [activationMobile, setActivationMobile] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");

  const trimmedForm = useMemo(
    () => ({
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      password: form.password,
    }),
    [form],
  );

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      setCreatedUser(data);
      setActivationMobile(data.mobile ?? trimmedForm.mobile);
      setStep("otp");
      setOtpCode("");
      activateMutation.reset();
    },
  });

  const activateMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      setStep("activated");
      onActivationComplete?.(activationMobile);
    },
  });

  const handleChange =
    (field: keyof CreateUserInput) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (mutation.isSuccess || mutation.isError) {
        mutation.reset();
      }
      setCreatedUser(null);
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(trimmedForm);
  };

  const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ActivateUserInput = {
      mobile: activationMobile,
      code: otpCode.trim(),
    };
    activateMutation.mutate(payload);
  };

  const handlePrefill = () => {
    setForm(examplePayload);
    setStep("form");
    if (mutation.isSuccess || mutation.isError) {
      mutation.reset();
    }
    activateMutation.reset();
    setCreatedUser(null);
  };

  const isDisabled =
    mutation.isPending ||
    trimmedForm.name === "" ||
    trimmedForm.email === "" ||
    trimmedForm.mobile === "" ||
    form.password === "";

  const errorMessage = (() => {
    if (!mutation.isError || !mutation.error) {
      return null;
    }

    if (mutation.error instanceof Error) {
      return mutation.error.message;
    }

    if (
      typeof mutation.error === "object" &&
      "message" in mutation.error &&
      typeof (mutation.error as { message?: unknown }).message === "string"
    ) {
      return (mutation.error as { message: string }).message;
    }

    if (typeof mutation.error === "string") {
      return mutation.error;
    }

    return null;
  })();

  const activationError = (() => {
    if (!activateMutation.isError || !activateMutation.error) {
      return null;
    }

    if (activateMutation.error instanceof Error) {
      return activateMutation.error.message;
    }

    if (
      typeof activateMutation.error === "object" &&
      "message" in activateMutation.error &&
      typeof (activateMutation.error as { message?: unknown }).message ===
        "string"
    ) {
      return (activateMutation.error as { message: string }).message;
    }

    if (typeof activateMutation.error === "string") {
      return activateMutation.error;
    }

    return null;
  })();

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
        <h1 className="text-3xl font-semibold text-white">
          Account onboarding
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Provide your details to create an operator account. We will send a
          one-time password to the mobile number you provide to activate the
          account. The OTP is logged by the backend while SMS integration is in
          progress.
        </p>
      </header>

      {step === "form" ? (
        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span className="font-medium text-slate-100">Name</span>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                  placeholder={examplePayload.name}
                  autoComplete="name"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span className="font-medium text-slate-100">Email</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                  placeholder={examplePayload.email}
                  autoComplete="email"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span className="font-medium text-slate-100">
                  Mobile number
                </span>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange("mobile")}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                  placeholder={examplePayload.mobile}
                  autoComplete="tel"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-300 sm:col-span-2">
                <span className="font-medium text-slate-100">Password</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                  placeholder={examplePayload.password}
                  autoComplete="new-password"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isDisabled}
                className="rounded-full border border-white/10 px-6 py-2 text-sm font-medium text-white/80 transition hover:border-teal-400/40 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
              >
                {mutation.isPending ? "Creating..." : "Sign up"}
              </button>
              <button
                type="button"
                onClick={handlePrefill}
                className="rounded-full bg-teal-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal-100 transition hover:bg-teal-500/30"
              >
                Prefill example
              </button>
              {mutation.isPending ? (
                <span className="text-xs text-teal-200">
                  Sending request...
                </span>
              ) : null}
            </div>

            {mutation.isError ? (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
                {errorMessage ??
                  "Something went wrong while contacting the API."}
              </div>
            ) : null}

            {mutation.isSuccess && createdUser ? (
              <div className="rounded-2xl border border-teal-500/40 bg-teal-500/10 p-4 text-sm text-teal-100">
                <p className="font-semibold">Account created.</p>
                <p className="mt-2 text-xs text-teal-200">
                  We sent a one-time password to {activationMobile}. Enter it
                  below to activate your access.
                </p>
              </div>
            ) : null}
          </form>
        </section>
      ) : null}

      {step === "otp" ? (
        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
          <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                Enter the activation code sent to
                <span className="ml-1 font-semibold text-teal-200">
                  {activationMobile}
                </span>
                . Check the backend logs if SMS delivery is not yet configured.
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              <span className="font-medium text-slate-100">
                Activation code
              </span>
              <input
                id="otp"
                name="otp"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-lg tracking-[0.5em] text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={activateMutation.isPending || otpCode.trim() === ""}
                className="rounded-full border border-white/10 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-teal-400/40 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
              >
                {activateMutation.isPending ? "Verifying..." : "Verify code"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  mutation.reset();
                  activateMutation.reset();
                  setCreatedUser(null);
                }}
                className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-white/10"
              >
                Edit details
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Need a fresh code? Re-submit the signup form with your mobile
              number to issue a new OTP while SMS delivery is wired up.
            </p>

            {activateMutation.isError ? (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
                {activationError ??
                  "Invalid activation code. Please try again."}
              </div>
            ) : null}
          </form>
        </section>
      ) : null}

      {step === "activated" ? (
        <section className="rounded-3xl border border-teal-500/40 bg-teal-500/10 p-8 text-sm text-teal-100">
          <p className="font-semibold">Activation complete.</p>
          <p className="mt-2 text-xs text-teal-200">
            You can now sign in with your mobile number {activationMobile} and
            the password you set. OTP codes will be required on every login.
          </p>
        </section>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  buildEmptyAddressForm,
  toEditableAddress,
  useAddresses,
  useAddressMutations,
} from "@/lib/address-hooks";
import type {
  Address,
  AddressInput,
  UpdateAddressInput,
  User,
} from "@/lib/types";

interface AccountDashboardProps {
  user: User;
  initialAddresses: Address[];
}

type AddressFormState = {
  mode: "create" | "edit";
  values: AddressInput | UpdateAddressInput;
};

export function AccountDashboard({
  user,
  initialAddresses,
}: AccountDashboardProps) {
  const addressesQuery = useAddresses(initialAddresses);
  const addresses = addressesQuery.data ?? [];
  const {
    create: createAddressMutation,
    update: updateAddressMutation,
    remove: deleteAddressMutation,
    setDefault: setDefaultAddressMutation,
  } = useAddressMutations();

  const [formState, setFormState] = useState<AddressFormState | null>(null);

  useEffect(() => {
    if (addresses.length === 0) {
      setFormState((current) =>
        current && current.mode === "create"
          ? current
          : { mode: "create", values: buildEmptyAddressForm() },
      );
    }
  }, [addresses.length]);

  const handleAddressSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState) {
      return;
    }

    if (formState.mode === "create") {
      const payload = formState.values as AddressInput;
      createAddressMutation.mutate(payload, {
        onSuccess: () => setFormState(null),
      });
    } else {
      updateAddressMutation.mutate(formState.values as UpdateAddressInput, {
        onSuccess: () => setFormState(null),
      });
    }
  };

  const mutationError = (mutation: { error: unknown; isError: boolean }) => {
    if (!mutation.isError || !mutation.error) {
      return null;
    }
    const { error } = mutation;
    if (error instanceof Error) {
      return error.message;
    }
    if (
      typeof error === "object" &&
      error &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "Something went wrong.";
  };

  const createAddressError = mutationError(createAddressMutation);
  const updateAddressError = mutationError(updateAddressMutation);
  const deleteAddressError = mutationError(deleteAddressMutation);
  const setDefaultAddressError = mutationError(setDefaultAddressMutation);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Welcome, {user.name}
            </h1>
            <p className="text-sm text-slate-400">
              Manage your profile details and saved delivery addresses.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            <p>Mobile: {user.mobile}</p>
            <p>Role: {user.role}</p>
          </div>
        </header>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/60 p-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">My Addresses</h2>
            <p className="text-sm text-slate-400">
              Saved addresses help you speed through checkout. Default addresses
              are highlighted below.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setFormState({ mode: "create", values: buildEmptyAddressForm() })
            }
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-teal-400/40 hover:text-white"
          >
            Add address
          </button>
        </header>

        {addressesQuery.isLoading ? (
          <p className="text-xs text-slate-400">Loading addresses…</p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.id}
              className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-white">
                    {address.label}
                  </p>
                  <p className="text-xs text-slate-400">
                    {address.recipientName}
                  </p>
                </div>
                {address.isDefault ? (
                  <span className="rounded-full border border-teal-400/40 bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-100">
                    Default
                  </span>
                ) : null}
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <p>{address.line1}</p>
                {address.line2 ? <p>{address.line2}</p> : null}
                <p>
                  {address.city}, {address.region} {address.postalCode}
                </p>
                <p>{address.country}</p>
                <p className="text-slate-400">Phone: {address.phone}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    setFormState({
                      mode: "edit",
                      values: toEditableAddress(address),
                    })
                  }
                  className="rounded-full border border-white/10 px-3 py-1 transition hover:border-teal-400/40 hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this address?",
                      )
                    ) {
                      deleteAddressMutation.mutate(address.id);
                    }
                  }}
                  className="rounded-full border border-white/10 px-3 py-1 text-rose-200 transition hover:border-rose-400/40 hover:text-rose-100"
                  disabled={deleteAddressMutation.isPending}
                >
                  Delete
                </button>
                {!address.isDefault ? (
                  <button
                    type="button"
                    onClick={() => setDefaultAddressMutation.mutate(address.id)}
                    className="rounded-full border border-white/10 px-3 py-1 transition hover:border-teal-400/40 hover:text-white"
                    disabled={setDefaultAddressMutation.isPending}
                  >
                    Make default
                  </button>
                ) : null}
              </div>
            </article>
          ))}
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-400">
              No addresses saved yet. Add one to get started.
            </div>
          ) : null}
        </div>

        {!formState && deleteAddressError ? (
          <ErrorBanner message={deleteAddressError} />
        ) : null}
        {!formState && setDefaultAddressError ? (
          <ErrorBanner message={setDefaultAddressError} />
        ) : null}

        {formState ? (
          <form
            className="space-y-5 rounded-2xl border border-white/10 bg-slate-950/70 p-6"
            onSubmit={handleAddressSubmit}
          >
            <h3 className="text-lg font-semibold text-white">
              {formState.mode === "create" ? "Add new address" : "Edit address"}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <AddressField
                label="Label"
                value={formState.values.label}
                onChange={(value) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: { ...current.values, label: value },
                        }
                      : current,
                  )
                }
                required
              />
              <AddressField
                label="Recipient name"
                value={formState.values.recipientName}
                onChange={(value) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: { ...current.values, recipientName: value },
                        }
                      : current,
                  )
                }
                required
              />
              <AddressField
                label="Address line 1"
                value={formState.values.line1}
                onChange={(value) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: { ...current.values, line1: value },
                        }
                      : current,
                  )
                }
                required
              />
              <AddressField
                label="Address line 2"
                value={formState.values.line2 ?? ""}
                onChange={(value) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: { ...current.values, line2: value },
                        }
                      : current,
                  )
                }
              />
              <AddressField
                label="City"
                value={formState.values.city}
                onChange={(value) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: { ...current.values, city: value },
                        }
                      : current,
                  )
                }
                required
              />
              <AddressField
                label="Region"
                value={formState.values.region}
                onChange={(value) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: { ...current.values, region: value },
                        }
                      : current,
                  )
                }
                required
              />
              <AddressField
                label="Postal code"
                value={formState.values.postalCode}
                onChange={(value) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: { ...current.values, postalCode: value },
                        }
                      : current,
                  )
                }
                required
              />
              <AddressField
                label="Country"
                value={formState.values.country}
                onChange={(value) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: { ...current.values, country: value },
                        }
                      : current,
                  )
                }
                required
              />
              <AddressField
                label="Phone"
                value={formState.values.phone}
                onChange={(value) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: { ...current.values, phone: value },
                        }
                      : current,
                  )
                }
                required
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={Boolean(formState.values.isDefault)}
                onChange={(event) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          values: {
                            ...current.values,
                            isDefault: event.target.checked,
                          },
                        }
                      : current,
                  )
                }
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-teal-400 focus:ring-teal-400"
              />
              Use as default shipping address
            </label>

            <div className="flex flex-wrap gap-3 text-xs text-slate-200">
              <button
                type="submit"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-teal-400/40 hover:text-white"
                disabled={
                  createAddressMutation.isPending ||
                  updateAddressMutation.isPending
                }
              >
                {formState.mode === "create"
                  ? "Save address"
                  : "Update address"}
              </button>
              <button
                type="button"
                onClick={() => setFormState(null)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                Cancel
              </button>
            </div>

            {createAddressError ? (
              <ErrorBanner message={createAddressError} />
            ) : null}
            {updateAddressError ? (
              <ErrorBanner message={updateAddressError} />
            ) : null}
            {deleteAddressError ? (
              <ErrorBanner message={deleteAddressError} />
            ) : null}
            {setDefaultAddressError ? (
              <ErrorBanner message={setDefaultAddressError} />
            ) : null}
          </form>
        ) : null}
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-white">Development note</h2>
        <p className="mt-2 text-xs text-slate-400">
          OTP codes are currently logged by the backend for test purposes. Check
          your Go API server logs after triggering login or activation flows to
          retrieve the verification code until SMS delivery is integrated.
        </p>
      </section>
    </div>
  );
}

function AddressField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300">
      <span className="font-medium text-slate-100">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
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

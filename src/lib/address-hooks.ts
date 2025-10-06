"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "@/lib/api-client";
import { useUnauthorizedRedirect } from "@/lib/auth";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from "@/lib/types";

export const ADDRESSES_QUERY_KEY = ["addresses"] as const;

export function useAddresses(initialData?: Address[]) {
  const query = useQuery<Address[], Error>({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: getAddresses,
    initialData,
  });

  useUnauthorizedRedirect(query.isError ? query.error : null);

  return query;
}

export function useAddressMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
  };

  const create = useMutation({
    mutationFn: createAddress,
    onSuccess: () => invalidate(),
  });

  const update = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => invalidate(),
  });

  const remove = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => invalidate(),
  });

  const setDefault = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => invalidate(),
  });

  return {
    create,
    update,
    remove,
    setDefault,
  };
}

export type AddressFormMode = "create" | "edit";

export function buildEmptyAddressForm(): CreateAddressInput {
  return {
    label: "",
    recipientName: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  };
}

export function toEditableAddress(address: Address): UpdateAddressInput {
  return {
    id: address.id,
    label: address.label,
    recipientName: address.recipientName,
    line1: address.line1,
    line2: address.line2 ?? "",
    city: address.city,
    region: address.region,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone,
    isDefault: address.isDefault,
  };
}

import type { AxiosInstance } from "axios";
import type {
  AccountView,
  LoginParams,
  LoginResponse,
  MeView,
} from "@repo/dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "./provider.js";

export const authKeys = {
  all: ["auth"] as const,
  accounts: () => [...authKeys.all, "accounts"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export async function listAccounts(http: AxiosInstance, signal?: AbortSignal) {
  const { data } = await http.get<AccountView[]>("auth/accounts", { signal });
  return data;
}

export async function login(http: AxiosInstance, body: LoginParams) {
  const { data } = await http.post<LoginResponse>("auth/login", body);
  return data;
}

export async function getMe(http: AxiosInstance, signal?: AbortSignal) {
  const { data } = await http.get<MeView>("auth/me", { signal });
  return data;
}

export function useAccounts() {
  const { http } = useApiClient();
  return useQuery({
    queryKey: authKeys.accounts(),
    queryFn: ({ signal }) => listAccounts(http, signal),
  });
}

export function useMe() {
  const { http } = useApiClient();
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: ({ signal }) => getMe(http, signal),
  });
}

export function useLogin() {
  const { http } = useApiClient();
  return useMutation({
    mutationFn: (body: LoginParams) => login(http, body),
  });
}

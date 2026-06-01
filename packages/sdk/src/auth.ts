import type { User } from "@satuwaktu/types";
import type { SatuwaktuClient } from "./client";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export const createAuthApi = (client: SatuwaktuClient) => {
  return {
    login: (data: LoginInput) =>
      client.post<{ message: string }>("/v1/auth/login", data),
    register: (data: RegisterInput) =>
      client.post<{ message: string }>("/v1/auth/register", data),
    logout: () => client.post<{ message: string }>("/v1/auth/logout"),
    me: (init?: RequestInit) => client.get<User>("/v1/auth/me", init),
  };
};

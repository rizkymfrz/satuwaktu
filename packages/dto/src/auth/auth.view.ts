export type Role = "owner" | "guest";

export interface AccountView {
  id: string;
  name: string;
  title: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  account: AccountView;
}

export interface MeView {
  role: Role;
  account: AccountView | null;
}

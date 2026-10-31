import type { AccountView } from '@repo/dto';

export const ACCOUNT_SELECT = { id: true, name: true, title: true } as const;

export function toAccountView(account: AccountView): AccountView {
  return { id: account.id, name: account.name, title: account.title };
}

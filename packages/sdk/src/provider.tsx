import { createContext, useContext, type ReactNode } from "react";
import type { ApiClient } from "./client.js";

const ApiContext = createContext<ApiClient | null>(null);

export function ApiProvider({
  client,
  children,
}: {
  client: ApiClient;
  children: ReactNode;
}) {
  return <ApiContext value={client}>{children}</ApiContext>;
}

export function useApiClient() {
  const client = useContext(ApiContext);
  if (!client) {
    throw new Error("useApiClient must be used within ApiProvider");
  }
  return client;
}

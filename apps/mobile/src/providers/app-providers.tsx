import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApiProvider } from "@repo/sdk";
import { SessionProvider } from "@/features/session/store";
import { SettingsProvider } from "@/features/settings/store";
import { apiClient, queryClient } from "@/lib/api";

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ApiProvider client={apiClient}>
          <SessionProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </SessionProvider>
        </ApiProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export { AppProviders };

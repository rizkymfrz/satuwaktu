import { Redirect } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAccounts } from "@repo/sdk";
import { QueryError } from "@/components/layout/query-error";
import { Enter } from "@/components/motion/enter";
import { RevealScrollView } from "@/components/motion/reveal";
import { PatternBackground } from "@/components/scrapbook/pattern-background";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import { AccountTile } from "@/features/session/components/account-tile";
import { GateHero } from "@/features/session/components/gate-hero";
import { LoginForm } from "@/features/session/components/login-form";
import { useSession } from "@/features/session/store";
import {
  KeyboardRevealContext,
  useKeyboardReveal,
} from "@/lib/keyboard-reveal";
import { Space } from "@/theme/space";

function GateScreen() {
  const insets = useSafeAreaInsets();
  const { role, enterAsGuest } = useSession();
  const accounts = useAccounts();
  const { ref, reveal, bottomInset, scrollProps } = useKeyboardReveal();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  if (role) {
    return <Redirect href="/home" />;
  }
  const selected =
    accounts.data?.find((account) => account.id === selectedId) ?? null;
  return (
    <View className="flex-1 bg-background">
      <PatternBackground variant="grid" />
      <KeyboardRevealContext.Provider value={reveal}>
        <RevealScrollView
          ref={ref}
          {...scrollProps}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-8 px-4"
          contentContainerStyle={{
            paddingTop: insets.top + Space.xl,
            paddingBottom: insets.bottom + Space.xl + bottomInset,
          }}
        >
          <GateHero />
          <View className="gap-4">
            <TypographyH4 className="font-head">Masuk sebagai</TypographyH4>
            {accounts.isPending ? (
              <View className="gap-4 pr-1">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </View>
            ) : accounts.isError ? (
              <QueryError
                message="Tidak bisa terhubung ke server"
                onRetry={() => accounts.refetch()}
              />
            ) : (
              <View accessibilityRole="radiogroup" className="gap-4">
                {accounts.data.map((account, index) => (
                  <Enter key={account.id} index={index + 1}>
                    <AccountTile
                      account={account}
                      selected={account.id === selectedId}
                      onSelect={() => setSelectedId(account.id)}
                    />
                  </Enter>
                ))}
              </View>
            )}
          </View>
          {selected ? (
            <Enter key={selected.id}>
              <LoginForm account={selected} />
            </Enter>
          ) : null}
          <View className="items-center gap-4">
            <View className="w-full flex-row items-center gap-4">
              <Separator className="flex-1" />
              <TypographyMuted>atau</TypographyMuted>
              <Separator className="flex-1" />
            </View>
            <View className="w-full pr-1">
              <Button variant="outline" onPress={enterAsGuest}>
                <Text>Lihat sebagai tamu</Text>
              </Button>
            </View>
          </View>
        </RevealScrollView>
      </KeyboardRevealContext.Provider>
    </View>
  );
}

export { GateScreen };

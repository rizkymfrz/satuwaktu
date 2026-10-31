import { Check, UserRound } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { ACCOUNT_ICON } from "@/features/session/components/account-name";
import type { Account } from "@/features/session/types";
import { cn } from "@/lib/utils";

function AccountTile({
  account,
  selected,
  onSelect,
}: {
  account: Account;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${account.name}, ${account.title}`}
      onPress={onSelect}
      className="pr-1"
    >
      {({ pressed }) => (
        <ShadowBox
          size="md"
          pressed={pressed}
          contentClassName={cn(
            "flex-row items-center gap-4 rounded-md border-2 border-border p-4",
            selected ? "bg-primary" : "bg-card",
          )}
        >
          <View className="size-12 items-center justify-center rounded-full border-2 border-border bg-card">
            <Icon as={ACCOUNT_ICON[account.id] ?? UserRound} size={22} />
          </View>
          <View className="flex-1 gap-1">
            <TypographySmall numberOfLines={1} className="font-head text-base">
              {account.name}
            </TypographySmall>
            <TypographyMuted
              numberOfLines={1}
              className={cn("text-xs", selected && "text-primary-foreground")}
            >
              {account.title}
            </TypographyMuted>
          </View>
          <View
            className={cn(
              "size-6 items-center justify-center rounded-full border-2 border-border",
              selected ? "bg-card" : "bg-transparent",
            )}
          >
            {selected ? <Icon as={Check} size={14} /> : null}
          </View>
        </ShadowBox>
      )}
    </Pressable>
  );
}

export { AccountTile };

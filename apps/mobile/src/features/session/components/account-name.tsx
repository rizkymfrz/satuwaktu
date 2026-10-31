import { Moon, Sun, type LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const ACCOUNT_ICON: Record<string, LucideIcon> = {
  "akun-rizky": Sun,
  "akun-ann": Moon,
};

function AccountName({
  account,
  className,
  iconSize = 12,
}: {
  account: { id: string; name: string };
  className?: string;
  iconSize?: number;
}) {
  const icon = ACCOUNT_ICON[account.id];
  return (
    <View className="flex-row items-center gap-1">
      <TypographySmall numberOfLines={1} className={cn("shrink", className)}>
        {account.name}
      </TypographySmall>
      {icon ? <Icon as={icon} size={iconSize} strokeWidth={2.5} /> : null}
    </View>
  );
}

export { ACCOUNT_ICON, AccountName };

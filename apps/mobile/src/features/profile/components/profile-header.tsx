import { UserRound } from "lucide-react-native";
import { View } from "react-native";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import {
  ACCOUNT_ICON,
  AccountName,
} from "@/features/session/components/account-name";
import { useSession } from "@/features/session/store";

function ProfileHeader() {
  const { account, role } = useSession();
  const AvatarIcon = account ? ACCOUNT_ICON[account.id] : undefined;
  return (
    <View className="items-center gap-4 py-2">
      <View className="size-20">
        <Avatar alt={account?.name ?? "Tamu"} className="size-20">
          <AvatarFallback className="bg-primary">
            <Icon as={AvatarIcon ?? UserRound} size={32} strokeWidth={2} />
          </AvatarFallback>
        </Avatar>
      </View>
      <View className="items-center gap-1">
        {account ? (
          <AccountName
            account={account}
            className="font-head text-2xl leading-8"
            iconSize={20}
          />
        ) : (
          <TypographyH3 className="font-head">Tamu</TypographyH3>
        )}
        <TypographyMuted>
          {role === "owner" ? account?.title : "Hanya melihat fragmen public"}
        </TypographyMuted>
      </View>
    </View>
  );
}

export { ProfileHeader };

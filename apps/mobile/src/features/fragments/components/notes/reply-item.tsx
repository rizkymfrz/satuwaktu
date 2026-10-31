import { View } from "react-native";
import type { ReplyView } from "@repo/dto";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { AccountName } from "@/features/session/components/account-name";
import { timeAgo } from "@/lib/format";

function ReplyItem({ reply }: { reply: ReplyView }) {
  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-2">
        <AccountName
          account={reply.author}
          className="text-sm font-medium"
          iconSize={13}
        />
        <TypographyMuted className="text-xs">
          {timeAgo(reply.createdAt)}
        </TypographyMuted>
      </View>
      <TypographySmall className="font-normal">{reply.text}</TypographySmall>
    </View>
  );
}

export { ReplyItem };

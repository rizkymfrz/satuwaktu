import { CornerDownRight, VenetianMask } from "lucide-react-native";
import { View } from "react-native";
import type { CommentView } from "@repo/dto";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { tiltFor } from "@/components/scrapbook/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { ReplyComposer } from "@/features/fragments/components/notes/reply-composer";
import { ReplyItem } from "@/features/fragments/components/notes/reply-item";
import { timeAgo } from "@/lib/format";

function NoteItem({
  comment,
  canReply,
  replying,
  onStartReply,
  onSubmitReply,
  onCancelReply,
}: {
  comment: CommentView;
  canReply: boolean;
  replying: boolean;
  onStartReply: () => void;
  onSubmitReply: (text: string) => Promise<boolean>;
  onCancelReply: () => void;
}) {
  return (
    <TapedPaper
      tape="right"
      variant="note"
      seed={comment.id}
      tilt={tiltFor(comment.id, 1.5)}
      contentClassName="gap-2 p-4"
    >
      <View className="flex-row items-center gap-2">
        <View className="size-6 items-center justify-center rounded-full border-2 border-border bg-muted">
          <Icon as={VenetianMask} size={14} />
        </View>
        <TypographySmall className="leading-5">Anonim</TypographySmall>
        <TypographyMuted className="text-xs">
          {timeAgo(comment.createdAt)}
        </TypographyMuted>
      </View>
      <TypographySmall className="pl-8 font-normal">
        {comment.text}
      </TypographySmall>
      {comment.replies.length > 0 ? (
        <View className="ml-8 gap-4 border-l-2 border-border pl-4">
          {comment.replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </View>
      ) : null}
      {canReply && !replying ? (
        <View className="ml-8 flex-row">
          <Button
            variant="link"
            size="xs"
            hitSlop={8}
            onPress={onStartReply}
            accessibilityLabel="Balas titipan kata"
          >
            <Icon as={CornerDownRight} size={12} />
            <Text>Balas</Text>
          </Button>
        </View>
      ) : null}
      {canReply && replying ? (
        <ReplyComposer onSubmit={onSubmitReply} onCancel={onCancelReply} />
      ) : null}
    </TapedPaper>
  );
}

export { NoteItem };

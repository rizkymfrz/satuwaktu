import { MessageSquare } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import {
  isApiError,
  useComments,
  useCreateComment,
  useReplyToComment,
} from "@repo/sdk";
import { EmptyState } from "@/components/layout/empty-state";
import { QueryError } from "@/components/layout/query-error";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { TypographyH4 } from "@/components/ui/typography";
import { NoteComposer } from "@/features/fragments/components/notes/note-composer";
import { NoteItem } from "@/features/fragments/components/notes/note-item";
import { useSession } from "@/features/session/store";

function sendErrorMessage(error: unknown, fallback: string) {
  return isApiError(error) && error.status === 429
    ? "Terlalu banyak percobaan, coba lagi sebentar"
    : fallback;
}

function FragmentNotes({
  fragmentId,
  total,
}: {
  fragmentId: string;
  total: number;
}) {
  const { role } = useSession();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const query = useComments(fragmentId);
  const create = useCreateComment(fragmentId);
  const reply = useReplyToComment();
  const comments = query.data?.pages.flatMap((page) => page.items) ?? [];
  const submitComment = async (text: string) => {
    try {
      await create.mutateAsync({ text });
      return true;
    } catch (error) {
      toast.error(sendErrorMessage(error, "Gagal mengirim titipan kata."));
      return false;
    }
  };
  const submitReply = async (commentId: string, text: string) => {
    try {
      await reply.mutateAsync({ commentId, body: { text } });
      setReplyingTo(null);
      return true;
    } catch (error) {
      toast.error(sendErrorMessage(error, "Gagal mengirim balasan."));
      return false;
    }
  };
  return (
    <View className="gap-4">
      <TypographyH4 className="font-head">Titipan Kata ({total})</TypographyH4>
      {query.isPending ? (
        <View className="items-center py-2">
          <Spinner />
        </View>
      ) : query.isError && comments.length === 0 ? (
        <QueryError
          message="Tidak bisa memuat titipan kata"
          onRetry={() => query.refetch()}
          className="py-2"
        />
      ) : comments.length === 0 ? (
        <EmptyState compact icon={MessageSquare} className="py-2">
          Belum ada kata yang dititipkan. Jadilah yang pertama.
        </EmptyState>
      ) : (
        <View className="gap-8">
          {comments.map((comment) => (
            <NoteItem
              key={comment.id}
              comment={comment}
              canReply={role === "owner"}
              replying={replyingTo === comment.id}
              onStartReply={() => setReplyingTo(comment.id)}
              onSubmitReply={(text) => submitReply(comment.id, text)}
              onCancelReply={() => setReplyingTo(null)}
            />
          ))}
          {query.hasNextPage ? (
            <Button
              variant="outline"
              disabled={query.isFetchingNextPage}
              onPress={() => query.fetchNextPage()}
            >
              <Text>
                {query.isFetchingNextPage ? "Memuat…" : "Muat lebih banyak"}
              </Text>
            </Button>
          ) : null}
        </View>
      )}
      <NoteComposer onSubmit={submitComment} />
    </View>
  );
}

export { FragmentNotes };

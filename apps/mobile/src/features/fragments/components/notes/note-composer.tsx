import { Pencil, Send } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { MAX_COMMENT_LENGTH } from "@repo/dto";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { TypographyMuted } from "@/components/ui/typography";

function NoteComposer({
  onSubmit,
}: {
  onSubmit: (text: string) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const trimmed = draft.trim();
  const close = () => {
    setDraft("");
    setOpen(false);
  };
  const submit = async () => {
    if (!trimmed || sending) {
      return;
    }
    setSending(true);
    try {
      if (await onSubmit(trimmed)) {
        close();
      }
    } finally {
      setSending(false);
    }
  };
  if (!open) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Titipkan kata"
        onPress={() => setOpen(true)}
        className="pr-1"
      >
        {({ pressed }) => (
          <ShadowBox
            size="md"
            pressed={pressed}
            contentClassName="h-10 flex-row items-center gap-2 rounded-md border-2 border-border bg-input px-4"
          >
            <Icon as={Pencil} size={16} />
            <TypographyMuted className="flex-1 text-base" numberOfLines={1}>
              Titipkan kata tanpa nama…
            </TypographyMuted>
          </ShadowBox>
        )}
      </Pressable>
    );
  }
  return (
    <View className="gap-2">
      <Textarea
        autoFocus
        value={draft}
        onChangeText={setDraft}
        placeholder="Titipkan kata tanpa nama…"
        accessibilityLabel="Titipan kata anonim"
        maxLength={MAX_COMMENT_LENGTH}
      />
      <Button
        shadowSize="md"
        disabled={!trimmed || sending}
        onPress={submit}
        accessibilityLabel="Kirim titipan kata"
      >
        <Icon as={Send} size={16} />
        <Text>Kirim</Text>
      </Button>
      <Button variant="ghost" size="sm" onPress={close}>
        <Text>Batal</Text>
      </Button>
    </View>
  );
}

export { NoteComposer };

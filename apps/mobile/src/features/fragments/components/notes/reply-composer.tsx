import { Send } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { MAX_COMMENT_LENGTH } from "@repo/dto";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";

function ReplyComposer({
  onSubmit,
  onCancel,
}: {
  onSubmit: (text: string) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const trimmed = draft.trim();
  const submit = async () => {
    if (!trimmed || sending) {
      return;
    }
    setSending(true);
    try {
      await onSubmit(trimmed);
    } finally {
      setSending(false);
    }
  };
  return (
    <View className="ml-8 gap-2">
      <Textarea
        autoFocus
        value={draft}
        onChangeText={setDraft}
        placeholder="Balas dengan sepatah kata…"
        accessibilityLabel="Balasan"
        maxLength={MAX_COMMENT_LENGTH}
      />
      <Button
        shadowSize="md"
        disabled={!trimmed || sending}
        onPress={submit}
        accessibilityLabel="Kirim balasan"
      >
        <Icon as={Send} size={16} />
        <Text>Kirim balasan</Text>
      </Button>
      <Button variant="ghost" size="sm" onPress={onCancel}>
        <Text>Batal</Text>
      </Button>
    </View>
  );
}

export { ReplyComposer };

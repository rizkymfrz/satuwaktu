import { Eye, EyeOff, LogIn } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Text } from "@/components/ui/text";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import { loginErrorMessage } from "@/features/session/login-error";
import { useSession } from "@/features/session/store";
import type { Account } from "@/features/session/types";

function LoginForm({ account }: { account: Account }) {
  const { signIn } = useSession();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const change = (value: string) => {
    setPassword(value);
    setError(null);
  };
  const submit = async () => {
    if (!password || submitting) {
      return;
    }
    setSubmitting(true);
    try {
      await signIn({ accountId: account.id, password });
    } catch (caught) {
      const message = loginErrorMessage(caught);
      setError(message);
      toast.error(message);
      setSubmitting(false);
    }
  };
  return (
    <View className="gap-4 pr-1">
      <TypographyH4 className="font-head">
        Kata sandi {account.name}
      </TypographyH4>
      <View className="flex-row items-center gap-4">
        <View className="flex-1">
          <Input
            value={password}
            onChangeText={change}
            placeholder="Kata sandi"
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            returnKeyType="go"
            onSubmitEditing={submit}
            editable={!submitting}
            invalid={error !== null}
            accessibilityLabel={`Kata sandi ${account.name}`}
          />
        </View>
        <Button
          variant="outline"
          size="icon"
          accessibilityLabel={visible ? "Sembunyikan sandi" : "Tampilkan sandi"}
          onPress={() => setVisible((current) => !current)}
        >
          <Icon as={visible ? EyeOff : Eye} size={20} />
        </Button>
      </View>
      {error ? <TypographyMuted>{error}</TypographyMuted> : null}
      <Button disabled={!password || submitting} onPress={submit}>
        <Icon as={LogIn} size={16} />
        <Text>{submitting ? "Masuk..." : "Masuk"}</Text>
      </Button>
    </View>
  );
}

export { LoginForm };

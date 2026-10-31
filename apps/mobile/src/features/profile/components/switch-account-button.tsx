import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useSession } from "@/features/session/store";

function SwitchAccountButton() {
  const router = useRouter();
  const { role, signOut } = useSession();
  return (
    <Button
      variant={role === "owner" ? "secondary" : "default"}
      onPress={async () => {
        await signOut();
        router.replace("/");
      }}
    >
      <Icon as={LogOut} size={16} />
      <Text>{role === "owner" ? "Ganti akun" : "Masuk dengan akun"}</Text>
    </Button>
  );
}

export { SwitchAccountButton };

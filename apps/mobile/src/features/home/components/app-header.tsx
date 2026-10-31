import { useRouter } from "expo-router";
import { Info, Map as MapIcon, Search } from "lucide-react-native";
import { View } from "react-native";
import { PaperHeader } from "@/components/layout/paper-header";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TypographyH3 } from "@/components/ui/typography";

function AppHeader() {
  const router = useRouter();
  return (
    <PaperHeader seed="satuwaktu">
      <View className="flex-1">
        <TypographyH3 className="font-head">satuwaktu</TypographyH3>
      </View>
      <View className="flex-row gap-2">
        <Button
          variant="outline"
          size="icon"
          shadowSize="md"
          accessibilityLabel="Cari fragmen"
          onPress={() => router.push("/search")}
        >
          <Icon as={Search} size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          shadowSize="md"
          accessibilityLabel="Peta kenangan"
          onPress={() => router.push("/map")}
        >
          <Icon as={MapIcon} size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          shadowSize="md"
          accessibilityLabel="Tentang kami"
          onPress={() => router.push("/about")}
        >
          <Icon as={Info} size={18} />
        </Button>
      </View>
    </PaperHeader>
  );
}

export { AppHeader };

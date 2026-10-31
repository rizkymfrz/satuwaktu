import { useRouter } from "expo-router";
import { ChevronRight, Info } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

function AboutLink() {
  const router = useRouter();
  return (
    <Item
      variant="outline"
      onPress={() => router.push("/about")}
      accessibilityLabel="Tentang kami"
    >
      <ItemMedia variant="icon">
        <Icon as={Info} size={20} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Tentang kami</ItemTitle>
        <ItemDescription>Cerita di balik satuwaktu</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Icon as={ChevronRight} size={18} />
      </ItemActions>
    </Item>
  );
}

export { AboutLink };

import { useRouter } from "expo-router";
import { BookOpen, MapPin, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { Fragment } from "@/features/archive/types";

function Chip({
  icon,
  label,
  accessibilityLabel,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      className="max-w-full active:opacity-70"
    >
      <Badge variant="outline" className="bg-card">
        <Icon as={icon} size={12} />
        <Text numberOfLines={1}>{label}</Text>
      </Badge>
    </Pressable>
  );
}

function ContextChips({ fragment }: { fragment: Fragment }) {
  const router = useRouter();
  const { chapter, location } = fragment;
  if (!chapter && !location) {
    return null;
  }
  return (
    <View className="flex-row flex-wrap gap-2 pt-1">
      {chapter ? (
        <Chip
          icon={BookOpen}
          label={chapter.name}
          accessibilityLabel={`Buka babak ${chapter.name}`}
          onPress={() =>
            router.push({
              pathname: "/chapters/[id]",
              params: { id: chapter.id },
            })
          }
        />
      ) : null}
      {location ? (
        <Chip
          icon={MapPin}
          label={location.name || "Lihat di peta"}
          accessibilityLabel="Lihat lokasi di peta"
          onPress={() =>
            router.push({ pathname: "/map", params: { focus: fragment.id } })
          }
        />
      ) : null}
    </View>
  );
}

export { ContextChips };

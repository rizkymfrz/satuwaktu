import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { TypographyMuted } from "@/components/ui/typography";
import { Polaroid } from "@/features/archive/components/polaroid";
import type { Fragment } from "@/features/archive/types";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

function NeighborSlot({
  direction,
  fragment,
  onOpen,
}: {
  direction: "older" | "newer";
  fragment: Fragment | undefined;
  onOpen: (id: string) => void;
}) {
  if (!fragment) {
    return <View className="flex-1" />;
  }
  const older = direction === "older";
  const label = older ? "Lebih lama" : "Lebih baru";
  return (
    <View className="flex-1 gap-4 px-1">
      <View
        className={cn("flex-row items-center gap-1", !older && "justify-end")}
      >
        {older ? <Icon as={ArrowLeft} size={14} /> : null}
        <TypographyMuted className="text-xs">{label}</TypographyMuted>
        {older ? null : <Icon as={ArrowRight} size={14} />}
      </View>
      <Polaroid
        fragment={fragment}
        caption={formatShortDate(fragment.takenAt)}
        accessibilityLabel={`${label}: ${fragment.caption || "tanpa keterangan"}`}
        onPress={() => onOpen(fragment.id)}
      />
    </View>
  );
}

function NeighborNav({
  older,
  newer,
  onOpen,
}: {
  older: Fragment | undefined;
  newer: Fragment | undefined;
  onOpen: (id: string) => void;
}) {
  if (!older && !newer) {
    return null;
  }
  return (
    <View className="flex-row gap-4">
      <NeighborSlot direction="older" fragment={older} onOpen={onOpen} />
      <NeighborSlot direction="newer" fragment={newer} onOpen={onOpen} />
    </View>
  );
}

export { NeighborNav };

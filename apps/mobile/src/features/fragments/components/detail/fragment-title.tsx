import { View } from "react-native";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import type { Fragment } from "@/features/archive/types";
import { ContextChips } from "@/features/fragments/components/detail/context-chips";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

function FragmentTitle({ fragment }: { fragment: Fragment }) {
  return (
    <View className="gap-1">
      <TypographyH3
        className={cn(
          "font-head leading-8",
          !fragment.caption && "text-muted-foreground",
        )}
      >
        {fragment.caption || "Tanpa keterangan"}
      </TypographyH3>
      <TypographyMuted>{timeAgo(fragment.takenAt)}</TypographyMuted>
      <ContextChips fragment={fragment} />
    </View>
  );
}

export { FragmentTitle };

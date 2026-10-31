import {
  Check,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

function CollapsibleSection({
  icon,
  title,
  summary,
  hint,
  done,
  children,
}: {
  icon: LucideIcon;
  title: string;
  summary: string;
  hint?: string;
  done: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View className="gap-4">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${title}, ${summary}`}
        onPress={() => setOpen((current) => !current)}
        className="pr-1"
      >
        {({ pressed }) => (
          <ShadowBox
            size="md"
            pressed={pressed}
            contentClassName="flex-row items-center gap-4 rounded-md border-2 border-border bg-card p-4"
          >
            <View
              className={cn(
                "size-10 items-center justify-center rounded-full border-2 border-border",
                done ? "bg-primary" : "bg-muted",
              )}
            >
              <Icon as={done ? Check : icon} size={18} />
            </View>
            <View className="flex-1 gap-1">
              <TypographySmall className="text-base">{title}</TypographySmall>
              <TypographyMuted numberOfLines={1} className="text-xs">
                {summary}
              </TypographyMuted>
            </View>
            <Icon as={open ? ChevronUp : ChevronDown} size={18} />
          </ShadowBox>
        )}
      </Pressable>
      {open ? (
        <View className="gap-4">
          {hint ? (
            <TypographyMuted className="text-xs">{hint}</TypographyMuted>
          ) : null}
          {children}
        </View>
      ) : null}
    </View>
  );
}

export { CollapsibleSection };

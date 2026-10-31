import { Inbox, type LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";
import { LINE_HEIGHT } from "@/components/scrapbook/constants";
import { Sticker } from "@/components/scrapbook/sticker";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Icon } from "@/components/ui/icon";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

function EmptyState({
  children,
  title,
  icon = Inbox,
  action,
  fill = false,
  compact = false,
  className,
}: {
  children: ReactNode;
  title?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  fill?: boolean;
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <View
        className={cn(
          "items-center gap-2",
          fill && "flex-1 justify-center px-4",
          className,
        )}
      >
        <View className="size-10 items-center justify-center rounded-full border-2 border-border bg-primary">
          <Icon as={icon} size={18} />
        </View>
        <TypographyMuted className="text-center">{children}</TypographyMuted>
        {action}
      </View>
    );
  }
  return (
    <View
      className={cn(
        "w-full items-center",
        fill && "flex-1 justify-center px-4",
        className,
      )}
    >
      <View className="w-full max-w-96">
        <TapedPaper
          tape="center"
          variant="lined"
          seed={title ?? "kosong"}
          tilt={-1}
          contentClassName="items-center p-4"
        >
          <View className="w-full items-center">
            <View
              className="items-center justify-center"
              style={{ height: LINE_HEIGHT * 3 }}
            >
              <View className="size-14 items-center justify-center rounded-full border-2 border-border bg-primary">
                <Icon as={icon} size={24} />
              </View>
            </View>
            {title ? (
              <TypographyH4 className="text-center font-head text-lg leading-6">
                {title}
              </TypographyH4>
            ) : null}
            <TypographyMuted className="text-center text-sm leading-6">
              {children}
            </TypographyMuted>
            {action ? (
              <View className="justify-end" style={{ height: LINE_HEIGHT * 2 }}>
                {action}
              </View>
            ) : null}
          </View>
        </TapedPaper>
        <Sticker
          kind="flower"
          tone={2}
          size={28}
          tilt={12}
          className="absolute -bottom-2 left-2"
        />
        <Sticker
          kind="star"
          tone={3}
          size={24}
          tilt={-10}
          className="absolute -right-1 bottom-4"
        />
      </View>
    </View>
  );
}

export { EmptyState };

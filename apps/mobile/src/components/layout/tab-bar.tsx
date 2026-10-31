import type { BottomTabBarProps } from "expo-router/js-tabs";
import {
  BookOpen,
  Clock,
  Home,
  Plus,
  User,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Paper } from "@/components/scrapbook/paper";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Space } from "@/theme/space";

const TAB_META: Record<string, { label: string; icon: LucideIcon }> = {
  home: { label: "Beranda", icon: Home },
  timeline: { label: "Linimasa", icon: Clock },
  capture: { label: "Abadikan", icon: Plus },
  chapters: { label: "Babak", icon: BookOpen },
  profile: { label: "Profil", icon: User },
};

function ArchiveTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className="z-10 overflow-visible">
      <Paper
        variant="kraft"
        torn="none"
        seed="tab-bar"
        shadow={false}
        bleed={{ bottom: Space.lg, left: Space.md, right: Space.md }}
        contentClassName="overflow-visible px-2 py-0"
      >
        <View
          accessibilityRole="tablist"
          className="flex-row overflow-visible"
          style={{ paddingBottom: insets.bottom }}
        >
          {state.routes.map((route, index) => {
            const options = descriptors[route.key].options as {
              href?: string | null;
            };
            const meta = TAB_META[route.name];
            if (options.href === null || !meta) {
              return null;
            }
            const focused = state.index === index;
            const round = route.name === "capture";
            const press = () => {
              const event = emitter.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigateToTab(route.key);
              }
            };
            if (round) {
              return (
                <View
                  key={route.key}
                  className="flex-1 items-center justify-end overflow-visible py-2"
                >
                  <View className="absolute -top-4 size-12">
                    <Button
                      circle
                      size="icon-lg"
                      shadowSize="md"
                      role="tab"
                      accessibilityLabel={meta.label}
                      accessibilityState={{ selected: focused }}
                      className="size-12 rounded-full"
                      onPress={press}
                    >
                      <Icon as={meta.icon} size={20} strokeWidth={2.5} />
                    </Button>
                  </View>
                  <View className="border-2 border-transparent px-2 py-1">
                    <TypographySmall numberOfLines={1} className="text-[10px]">
                      {meta.label}
                    </TypographySmall>
                  </View>
                </View>
              );
            }
            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityLabel={meta.label}
                accessibilityState={{ selected: focused }}
                onPress={press}
                className="flex-1 items-center justify-center py-2"
              >
                <View
                  className={cn(
                    "items-center gap-0.5 rounded-md border-2 px-2 py-1",
                    focused ? "border-border bg-primary" : "border-transparent",
                  )}
                >
                  <Icon as={meta.icon} size={20} />
                  <TypographySmall numberOfLines={1} className="text-[10px]">
                    {meta.label}
                  </TypographySmall>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Paper>
    </View>
  );
}

export { ArchiveTabBar };

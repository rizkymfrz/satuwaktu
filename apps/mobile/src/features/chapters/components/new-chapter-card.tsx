import { ChevronRight, Plus } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Paper } from "@/components/scrapbook/paper";
import { Sticker } from "@/components/scrapbook/sticker";
import { pressShift, tiltFor } from "@/components/scrapbook/utils";
import { Icon } from "@/components/ui/icon";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";

function NewChapterCard({ onPress }: { onPress: () => void }) {
  return (
    <View className="pr-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Babak baru"
        onPress={onPress}
      >
        {({ pressed }) => (
          <>
            <Paper
              variant="kraft"
              torn="top"
              seed="chapter-baru"
              tilt={tiltFor("chapter-baru", 1)}
              pressed={pressed}
            >
              <View className="flex-row items-center gap-4 pt-2">
                <Icon as={Plus} size={24} />
                <View className="flex-1 gap-2">
                  <TypographyH4 className="font-head leading-7">
                    Babak baru
                  </TypographyH4>
                  <TypographyMuted className="text-xs leading-4">
                    Buka lembar yang baru, pelan-pelan
                  </TypographyMuted>
                </View>
                <Icon as={ChevronRight} size={20} />
              </View>
            </Paper>
            <Sticker
              kind="star"
              tone={2}
              size={32}
              tilt={14}
              className="absolute -right-1 top-4"
              style={pressShift(pressed)}
            />
          </>
        )}
      </Pressable>
    </View>
  );
}

export { NewChapterCard };

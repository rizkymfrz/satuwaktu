import { useRouter } from "expo-router";
import { Heart, Lock, Pin } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Frame } from "@/components/scrapbook/frame";
import { Tape } from "@/components/scrapbook/tape";
import { Tilt } from "@/components/scrapbook/tilt";
import { pressShift } from "@/components/scrapbook/utils";
import { Icon } from "@/components/ui/icon";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { FragmentPhoto } from "@/features/archive/components/fragment-photo";
import type { Fragment } from "@/features/archive/types";
import { formatShortDate } from "@/lib/format";

function UploadCard({ fragment }: { fragment: Fragment }) {
  const router = useRouter();
  return (
    <Tilt seed={fragment.id} max={2} className="w-40">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Buka fragmen: ${fragment.caption || "tanpa keterangan"}`}
        onPress={() =>
          router.push({
            pathname: "/fragments/[id]",
            params: { id: fragment.id },
          })
        }
      >
        {({ pressed }) => (
          <>
            <Frame pressed={pressed} contentClassName="p-2">
              <View>
                <View className="h-32 overflow-hidden border-2 border-border">
                  <FragmentPhoto
                    fragment={fragment}
                    className="absolute inset-0"
                  />
                </View>
                <View className="gap-2 pt-2">
                  <TypographySmall
                    numberOfLines={1}
                    className="h-5 text-sm font-normal leading-5"
                  >
                    {fragment.caption || "Tanpa keterangan"}
                  </TypographySmall>
                  <View className="flex-row items-center justify-between">
                    <TypographyMuted className="text-xs">
                      {formatShortDate(fragment.takenAt)}
                    </TypographyMuted>
                    <View className="flex-row items-center gap-2">
                      {fragment.pinned ? <Icon as={Pin} size={12} /> : null}
                      {fragment.visibility === "PRIVATE" ? (
                        <Icon as={Lock} size={12} />
                      ) : null}
                      <View className="flex-row items-center gap-1">
                        <Icon as={Heart} size={12} />
                        <TypographySmall className="text-xs">
                          {fragment.likes}
                        </TypographySmall>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Frame>
            <Tape
              seed={fragment.id}
              width={48}
              height={16}
              className="absolute -top-2 self-center"
              style={pressShift(pressed)}
            />
          </>
        )}
      </Pressable>
    </Tilt>
  );
}

export { UploadCard };

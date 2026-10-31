import { useRouter } from "expo-router";
import { ChevronRight, Heart } from "lucide-react-native";
import { Pressable, View } from "react-native";
import type { ChapterView } from "@repo/dto";
import { Frame } from "@/components/scrapbook/frame";
import { Paper } from "@/components/scrapbook/paper";
import { Sticker } from "@/components/scrapbook/sticker";
import { hashSeed, pressShift, tiltFor } from "@/components/scrapbook/utils";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import {
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/components/ui/typography";
import { FragmentPhoto } from "@/features/archive/components/fragment-photo";
import { Polaroid } from "@/features/archive/components/polaroid";
import { toFragment } from "@/features/archive/from-api";
import { formatRange } from "@/lib/format";

const STRIP = 4;

function ChapterCard({ chapter }: { chapter: ChapterView }) {
  const router = useRouter();
  const preview = chapter.preview.map(toFragment);
  const cover = preview[0];
  const empty = !cover;
  const strip = preview.slice(1, 1 + STRIP);
  const rest = chapter.fragmentCount - 1 - strip.length;
  const seed = hashSeed(chapter.name);
  return (
    <View className="pr-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Buka babak ${chapter.name}`}
        onPress={() =>
          router.push({
            pathname: "/chapters/[id]",
            params: { id: chapter.id },
          })
        }
      >
        {({ pressed }) => (
          <>
            <Paper
              variant="kraft"
              torn="top"
              seed={chapter.name}
              tilt={tiltFor(chapter.name, 1)}
              pressed={pressed}
            >
              <View className="gap-4">
                {cover ? (
                  <View className="px-4 pt-2">
                    <Polaroid fragment={cover} ratio={16 / 10} />
                  </View>
                ) : null}
                <View className="flex-row items-center justify-between gap-4">
                  <View className="flex-1 gap-2">
                    <TypographyH4 className="font-head leading-7">
                      {chapter.name}
                    </TypographyH4>
                    <TypographyMuted className="text-xs leading-4">
                      {empty || !chapter.firstTakenAt || !chapter.lastTakenAt
                        ? "Belum ada fragmen"
                        : `${chapter.fragmentCount} fragmen · ${formatRange(chapter.firstTakenAt, chapter.lastTakenAt)}`}
                    </TypographyMuted>
                  </View>
                  <Icon as={ChevronRight} size={20} />
                </View>
                {strip.length > 0 ? (
                  <View className="flex-row items-center gap-2">
                    {strip.map((fragment) => (
                      <FragmentPhoto
                        key={fragment.id}
                        fragment={fragment}
                        className="size-12 border-2 border-border"
                      />
                    ))}
                    {rest > 0 ? (
                      <Frame contentClassName="size-12 items-center justify-center">
                        <TypographySmall className="text-xs">
                          +{rest}
                        </TypographySmall>
                      </Frame>
                    ) : null}
                  </View>
                ) : null}
                {empty ? null : (
                  <>
                    <Separator />
                    <View className="flex-row items-center gap-2">
                      <Icon as={Heart} size={13} />
                      <TypographySmall className="text-xs font-normal">
                        {chapter.likeCount} like terkumpul
                      </TypographySmall>
                    </View>
                  </>
                )}
              </View>
            </Paper>
            <Sticker
              kind={seed % 2 === 0 ? "heart" : "star"}
              tone={seed % 5}
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

export { ChapterCard };

import { useRouter } from "expo-router";
import { Heart, Lock, Pin } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Frame } from "@/components/scrapbook/frame";
import { Sticker } from "@/components/scrapbook/sticker";
import { Tape } from "@/components/scrapbook/tape";
import { Tilt } from "@/components/scrapbook/tilt";
import { pressShift } from "@/components/scrapbook/utils";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import {
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/components/ui/typography";
import { FragmentPhoto } from "@/features/archive/components/fragment-photo";
import { AccountName } from "@/features/session/components/account-name";
import type { TimelineRowData } from "@/features/timeline/types";
import { formatShortDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

function Rail({
  first,
  last,
  header,
}: {
  first: boolean;
  last: boolean;
  header: boolean;
}) {
  const upper = first ? "bg-transparent" : "bg-border";
  const lower = last ? "bg-transparent" : "bg-border";
  return (
    <View className="w-8 items-center">
      <View className={cn("w-0.5 flex-1", upper)} />
      {header ? (
        <Sticker kind="flower" tone={2} size={28} />
      ) : (
        <View className="size-4 rounded-full border-2 border-border bg-primary" />
      )}
      <View className={cn("w-0.5 flex-1", lower)} />
      {header ? null : <View className={cn("h-4 w-0.5", lower)} />}
    </View>
  );
}

function TimelineRow({
  row,
  first,
  last,
}: {
  row: TimelineRowData;
  first: boolean;
  last: boolean;
}) {
  const router = useRouter();
  if (row.type === "header") {
    return (
      <View className="flex-row bg-background">
        <Rail first={first} last={last} header />
        <View className="flex-1 flex-row items-baseline gap-2 pb-4 pt-4">
          <TypographyH4 className="font-head">{row.label}</TypographyH4>
          <TypographyMuted className="text-xs">
            {row.count}
            {row.partial ? "+" : ""} fragmen
          </TypographyMuted>
        </View>
      </View>
    );
  }
  const { fragment } = row;
  return (
    <View className="flex-row">
      <Rail first={first} last={last} header={false} />
      <View className="flex-1 pb-4 pl-1 pr-2">
        <Tilt seed={fragment.id} max={1}>
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
                <Frame pressed={pressed} contentClassName="flex-row p-2">
                  <View className="flex-1 flex-row gap-2">
                    <FragmentPhoto
                      fragment={fragment}
                      className="w-24 border-2 border-border"
                    />
                    <View className="flex-1 gap-2">
                      <View className="flex-row items-center justify-between">
                        <TypographyMuted className="text-xs">
                          {formatShortDate(fragment.takenAt)} ·{" "}
                          {formatTime(fragment.takenAt)}
                        </TypographyMuted>
                        <View className="flex-row items-center gap-2">
                          {fragment.pinned ? <Icon as={Pin} size={12} /> : null}
                          {fragment.visibility === "PRIVATE" ? (
                            <Icon as={Lock} size={12} />
                          ) : null}
                        </View>
                      </View>
                      <TypographySmall
                        numberOfLines={1}
                        className="text-base leading-5"
                      >
                        {fragment.caption || "Tanpa keterangan"}
                      </TypographySmall>
                      {fragment.chapter ? (
                        <TypographyMuted className="text-xs">
                          {fragment.chapter.name}
                        </TypographyMuted>
                      ) : null}
                      <Separator />
                      <View className="flex-row items-center justify-between">
                        <AccountName
                          account={fragment.uploader}
                          className="text-xs font-normal"
                          iconSize={11}
                        />
                        <View className="flex-row items-center gap-1">
                          <Icon as={Heart} size={11} />
                          <TypographySmall className="text-xs">
                            {fragment.likes}
                          </TypographySmall>
                        </View>
                      </View>
                    </View>
                  </View>
                </Frame>
                <Tape
                  seed={fragment.id}
                  width={48}
                  height={16}
                  className="absolute -top-2 right-8"
                  style={pressShift(pressed)}
                />
              </>
            )}
          </Pressable>
        </Tilt>
      </View>
    </View>
  );
}

export { TimelineRow };

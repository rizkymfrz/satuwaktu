import { ArrowRight, Heart, Lock } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import {
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/components/ui/typography";
import { FragmentPhoto } from "@/features/archive/components/fragment-photo";
import { FragmentTile } from "@/features/archive/components/fragment-tile";
import { PinBadge } from "@/features/archive/components/pin-badge";
import type { Fragment } from "@/features/archive/types";
import { AccountName } from "@/features/session/components/account-name";
import { formatLongDate, formatTime, timeAgo } from "@/lib/format";

const TILE_WIDTH = 160;
const TILE_HEIGHT = 208;

function PinDetails({
  fragment,
  others,
  onSelect,
  onOpen,
}: {
  fragment: Fragment;
  others: Fragment[];
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <View className="gap-4">
      <View className="px-4 pt-4">
        <TapedPaper
          tape="left"
          variant="plain"
          seed={fragment.id}
          contentClassName="gap-4 p-4"
        >
          <View className="h-48 overflow-hidden border-2 border-border">
            <FragmentPhoto fragment={fragment} className="absolute inset-0" />
            <View className="absolute left-2 top-2 flex-row gap-2">
              {fragment.visibility === "PRIVATE" ? (
                <Badge variant="secondary">
                  <Icon as={Lock} size={11} />
                  <Text>Pribadi</Text>
                </Badge>
              ) : null}
            </View>
          </View>
          <View className="gap-4">
            <View className="gap-1">
              <TypographyH4 className="font-head" numberOfLines={1}>
                {fragment.caption || "Tanpa keterangan"}
              </TypographyH4>
              <TypographyMuted className="text-xs">
                {formatLongDate(fragment.takenAt)},{" "}
                {formatTime(fragment.takenAt)} · {timeAgo(fragment.takenAt)}
              </TypographyMuted>
            </View>
            {fragment.chapter ? (
              <View className="flex-row flex-wrap items-center gap-2">
                <Badge variant="outline">
                  <Text>{fragment.chapter.name}</Text>
                </Badge>
              </View>
            ) : null}
            <Separator />
            <View className="flex-row items-center justify-between">
              <AccountName
                account={fragment.uploader}
                className="text-sm font-normal"
                iconSize={14}
              />
              <View className="flex-row items-center gap-1">
                <Icon as={Heart} size={14} />
                <TypographySmall>{fragment.likes}</TypographySmall>
              </View>
            </View>
            <Button onPress={() => onOpen(fragment.id)}>
              <Text>Buka detail</Text>
              <Icon as={ArrowRight} size={16} />
            </Button>
          </View>
        </TapedPaper>
        {fragment.pinned ? (
          <PinBadge className="absolute right-2 top-2" size={36} />
        ) : null}
      </View>
      {others.length > 0 ? (
        <View className="gap-4">
          <TypographyH4 className="px-4 font-head">
            Kenangan lain di sini
          </TypographyH4>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-8 pb-4 pl-4 pr-8 pt-4"
          >
            {others.map((item) => (
              <FragmentTile
                key={item.id}
                fragment={item}
                width={TILE_WIDTH}
                height={TILE_HEIGHT}
                onOpen={() => onSelect(item.id)}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

export { PinDetails };

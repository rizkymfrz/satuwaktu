import { useRouter } from "expo-router";
import { BookOpen, Clock, Globe, Lock, MapPin, Pin } from "lucide-react-native";
import { View } from "react-native";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import {
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/components/ui/typography";
import type { Fragment } from "@/features/archive/types";
import { DateStamp } from "@/features/fragments/components/detail/date-stamp";
import { InfoRow } from "@/features/fragments/components/detail/info-row";
import { formatDate, formatTime, formatWeekday } from "@/lib/format";

function InfoCard({ fragment }: { fragment: Fragment }) {
  const router = useRouter();
  const { chapter, location } = fragment;
  const isPrivate = fragment.visibility === "PRIVATE";
  return (
    <TapedPaper
      tape="left"
      variant="plain"
      seed={fragment.id}
      contentClassName="gap-4 p-4"
    >
      <View className="flex-row items-center gap-4">
        <DateStamp iso={fragment.takenAt} />
        <View className="flex-1 gap-1">
          <TypographyH4 className="font-head">
            {formatWeekday(fragment.takenAt)}
          </TypographyH4>
          <TypographySmall className="text-base">
            {formatDate(fragment.takenAt)}
          </TypographySmall>
          <View className="flex-row items-center gap-1">
            <Icon as={Clock} size={12} />
            <TypographyMuted className="text-xs">
              Pukul {formatTime(fragment.takenAt)}
            </TypographyMuted>
          </View>
        </View>
      </View>
      <Separator />
      <InfoRow
        icon={BookOpen}
        label="Babak"
        value={chapter?.name ?? "Tanpa babak"}
        accessibilityLabel={chapter ? `Buka babak ${chapter.name}` : undefined}
        onPress={
          chapter
            ? () =>
                router.push({
                  pathname: "/chapters/[id]",
                  params: { id: chapter.id },
                })
            : undefined
        }
      />
      <InfoRow
        icon={MapPin}
        label="Lokasi"
        value={
          location ? location.name || "Lokasi di peta" : "Tidak ada lokasi"
        }
        detail={
          location
            ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
            : undefined
        }
        accessibilityLabel="Lihat lokasi di peta"
        onPress={
          location
            ? () =>
                router.push({
                  pathname: "/map",
                  params: { focus: fragment.id },
                })
            : undefined
        }
      />
      <View className="flex-row flex-wrap gap-2">
        <Badge variant={isPrivate ? "secondary" : "default"}>
          <Icon as={isPrivate ? Lock : Globe} size={11} />
          <Text>{isPrivate ? "Pribadi" : "Terbuka"}</Text>
        </Badge>
        {fragment.pinned ? (
          <Badge variant="outline">
            <Icon as={Pin} size={11} />
            <Text>Disematkan</Text>
          </Badge>
        ) : null}
      </View>
    </TapedPaper>
  );
}

export { InfoCard };

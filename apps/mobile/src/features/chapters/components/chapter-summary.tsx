import {
  CalendarRange,
  Heart,
  Images,
  type LucideIcon,
} from "lucide-react-native";
import { View } from "react-native";
import type { ChapterView } from "@repo/dto";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { formatCount, formatRange } from "@/lib/format";

function SummaryCell({
  icon,
  label,
  value,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      className={className}
    >
      <View className="items-center gap-1">
        <View className="size-10 items-center justify-center rounded-full border-2 border-border bg-primary">
          <Icon as={icon} size={18} />
        </View>
        <TypographySmall
          numberOfLines={1}
          className="font-head text-base leading-5"
        >
          {value}
        </TypographySmall>
        <TypographyMuted className="text-xs leading-4">{label}</TypographyMuted>
      </View>
    </View>
  );
}

function ChapterSummary({ chapter }: { chapter: ChapterView }) {
  const range =
    chapter.firstTakenAt && chapter.lastTakenAt
      ? formatRange(chapter.firstTakenAt, chapter.lastTakenAt)
      : "–";
  return (
    <TapedPaper
      tape="left"
      variant="plain"
      seed={chapter.id}
      contentClassName="gap-4 p-4"
    >
      <View className="flex-row items-start">
        <SummaryCell
          className="flex-1"
          icon={Images}
          label="Fragmen"
          value={formatCount(chapter.fragmentCount)}
        />
        <SummaryCell
          className="flex-1"
          icon={Heart}
          label="Suka"
          value={formatCount(chapter.likeCount)}
        />
        <SummaryCell
          className="flex-[1.5]"
          icon={CalendarRange}
          label="Rentang"
          value={range}
        />
      </View>
      {chapter.fragmentCount === 0 ? (
        <>
          <Separator />
          <TypographyMuted className="text-center">
            Belum ada fragmen di babak ini.
          </TypographyMuted>
        </>
      ) : null}
    </TapedPaper>
  );
}

export { ChapterSummary };

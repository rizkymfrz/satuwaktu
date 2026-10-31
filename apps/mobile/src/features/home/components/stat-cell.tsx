import { PatternBackground } from "@/components/scrapbook/pattern-background";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TypographyH3, TypographySmall } from "@/components/ui/typography";
import type { StatKind } from "@/features/home/types";
import { formatCount } from "@/lib/format";
import { Space } from "@/theme/space";
import { TONES } from "@/theme/tones";

const STAT_LABEL: Record<StatKind, string> = {
  fragments: "fragmen tersimpan",
  likes: "suka terkumpul",
  days: "hari sejak bermula",
};

function StatCell({
  kind,
  value,
  width,
  index,
}: {
  kind: StatKind;
  value: number;
  width: number;
  index: number;
}) {
  return (
    <ShadowBox
      size="md"
      style={{
        width,
        height: Math.round(width * 0.6),
        backgroundColor: TONES[(index + 1) % TONES.length],
      }}
      contentClassName="justify-center overflow-hidden rounded-md border-2 border-border p-4"
    >
      <PatternBackground variant="diagonal" size={Space.md} />
      <TypographyH3
        accessibilityLabel={`${formatCount(value)} ${STAT_LABEL[kind]}`}
        className="font-head text-3xl leading-9 text-primary-foreground"
      >
        {formatCount(value)}
      </TypographyH3>
      <TypographySmall className="text-xs font-normal text-primary-foreground">
        {STAT_LABEL[kind]}
      </TypographySmall>
    </ShadowBox>
  );
}

export { StatCell };

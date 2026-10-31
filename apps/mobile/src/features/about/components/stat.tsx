import { View } from "react-native";
import { PatternBackground } from "@/components/scrapbook/pattern-background";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TypographyH3, TypographySmall } from "@/components/ui/typography";
import { formatCount } from "@/lib/format";
import { Space } from "@/theme/space";
import { TONES } from "@/theme/tones";

function Stat({
  value,
  label,
  index,
}: {
  value: number;
  label: string;
  index: number;
}) {
  return (
    <View className="flex-1">
      <ShadowBox
        size="md"
        style={{ backgroundColor: TONES[(index + 1) % TONES.length] }}
        contentClassName="items-center gap-2 overflow-hidden rounded-md border-2 border-border px-2 py-4"
      >
        <PatternBackground variant="diagonal" size={Space.md} />
        <TypographyH3
          accessibilityLabel={`${formatCount(value)} ${label}`}
          className="font-head text-primary-foreground"
        >
          {formatCount(value)}
        </TypographyH3>
        <TypographySmall className="text-center text-xs font-normal text-primary-foreground">
          {label}
        </TypographySmall>
      </ShadowBox>
    </View>
  );
}

export { Stat };

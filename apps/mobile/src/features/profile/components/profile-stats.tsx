import {
  Heart,
  Images,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react-native";
import { View } from "react-native";
import { Paper } from "@/components/scrapbook/paper";
import { Icon } from "@/components/ui/icon";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { formatCount } from "@/lib/format";

function StatBox({
  icon,
  value,
  label,
  index,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  index: number;
}) {
  return (
    <View className="flex-1">
      <Paper
        variant={index % 2 === 0 ? "note" : "plain"}
        seed={label}
        tilt={index % 2 === 0 ? -1.5 : 1.5}
        contentClassName="items-center gap-2 px-2 py-4"
      >
        <View className="size-10 items-center justify-center rounded-full border-2 border-border bg-primary">
          <Icon as={icon} size={18} />
        </View>
        <TypographyH3 className="font-head">{formatCount(value)}</TypographyH3>
        <TypographyMuted className="text-center text-xs">
          {label}
        </TypographyMuted>
      </Paper>
    </View>
  );
}

function ProfileStats({
  fragments,
  likes,
  notes,
}: {
  fragments: number;
  likes: number;
  notes: number;
}) {
  return (
    <View className="flex-row gap-4 pr-1">
      <StatBox icon={Images} value={fragments} label="fragmen" index={0} />
      <StatBox icon={Heart} value={likes} label="suka" index={1} />
      <StatBox
        icon={MessageSquareText}
        value={notes}
        label="titipan kata"
        index={2}
      />
    </View>
  );
}

export { ProfileStats };

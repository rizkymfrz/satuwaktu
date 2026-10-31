import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";

function InfoRow({
  icon,
  label,
  value,
  detail,
  onPress,
  accessibilityLabel,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? accessibilityLabel : undefined}
      disabled={!onPress}
      onPress={onPress}
      className="flex-row items-center gap-4 active:opacity-70"
    >
      <View className="size-10 items-center justify-center rounded-full border-2 border-border bg-primary">
        <Icon as={icon} size={18} />
      </View>
      <View className="flex-1 gap-1">
        <TypographyMuted className="text-xs leading-4">{label}</TypographyMuted>
        <TypographySmall numberOfLines={1} className="text-base leading-5">
          {value}
        </TypographySmall>
        {detail ? (
          <TypographyMuted numberOfLines={1} className="text-xs leading-4">
            {detail}
          </TypographyMuted>
        ) : null}
      </View>
      {onPress ? <Icon as={ChevronRight} size={18} /> : null}
    </Pressable>
  );
}

export { InfoRow };

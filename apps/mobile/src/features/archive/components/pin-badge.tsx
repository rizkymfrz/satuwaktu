import { Pin } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";

const PIN_TILT_DEG = 14;

function PinBadge({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={className}
      style={{ transform: [{ rotate: `${PIN_TILT_DEG}deg` }] }}
    >
      <ShadowBox
        circle
        size="sm"
        contentClassName="items-center justify-center rounded-full border-2 border-border bg-secondary"
        style={{ width: size, height: size }}
      >
        <Icon
          as={Pin}
          size={Math.round(size * 0.55)}
          strokeWidth={2.5}
          className="text-secondary-foreground"
        />
      </ShadowBox>
    </View>
  );
}

export { PinBadge };

import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { useReveal } from "@/components/motion/reveal";
import { paperColors } from "@/components/scrapbook/constants";
import { TONES } from "@/theme/tones";

type StickerKind = "heart" | "star" | "flower";

const STICK = paperColors("light");

const HEART =
  "M12 21s-7.5-4.6-9.5-9.2C1 8 3.2 4.5 6.8 4.5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.6 0 5.8 3.5 4.3 7.3C19.5 16.4 12 21 12 21z";

const STAR =
  "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

const PETALS = Array.from({ length: 5 }, (_, index) => {
  const angle = (index / 5) * Math.PI * 2 - Math.PI / 2;
  return { cx: 12 + Math.cos(angle) * 6, cy: 12 + Math.sin(angle) * 6 };
});

function Sticker({
  kind = "heart",
  tone = 0,
  size = 32,
  tilt = 0,
  className,
  style,
}: {
  kind?: StickerKind;
  tone?: number;
  size?: number;
  tilt?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const fill = TONES[tone % TONES.length];
  const { ref, onLayout, progress } = useReveal(280);
  const popStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 0.4], [0, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(progress.get(), [0, 1], [0.2, 1]) }],
  }));
  const stroke = {
    stroke: STICK.ink,
    strokeWidth: 1.5,
    strokeLinejoin: "round",
  } as const;
  return (
    <View
      ref={ref}
      onLayout={onLayout}
      collapsable={false}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={className}
      style={style}
    >
      <Animated.View style={popStyle}>
        <View style={{ transform: [{ rotate: `${tilt}deg` }] }}>
          <Svg width={size} height={size} viewBox="0 0 24 24">
            {kind === "heart" ? (
              <Path d={HEART} fill={fill} {...stroke} />
            ) : null}
            {kind === "star" ? <Path d={STAR} fill={fill} {...stroke} /> : null}
            {kind === "flower" ? (
              <>
                {PETALS.map((petal) => (
                  <Circle
                    key={`${petal.cx}-${petal.cy}`}
                    cx={petal.cx}
                    cy={petal.cy}
                    r={4.2}
                    fill={fill}
                    {...stroke}
                  />
                ))}
                <Circle
                  cx={12}
                  cy={12}
                  r={3.4}
                  fill={STICK.cream}
                  {...stroke}
                />
              </>
            ) : null}
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
}

export { Sticker };
export type { StickerKind };

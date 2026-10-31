import { useId, useMemo } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Svg, { ClipPath, Defs, Line, Path } from "react-native-svg";
import { useReveal } from "@/components/motion/reveal";
import { paperColors } from "@/components/scrapbook/constants";
import { hashSeed } from "@/components/scrapbook/utils";
import { TONES } from "@/theme/tones";

const STICK = paperColors("light");
const TOOTH = 4;

function tapePath(width: number, height: number) {
  const points: string[] = [];
  for (let y = 0; y <= height; y += TOOTH) {
    points.push(`${(y / TOOTH) % 2 === 0 ? 0 : TOOTH} ${y}`);
  }
  for (let y = height; y >= 0; y -= TOOTH) {
    points.push(`${(y / TOOTH) % 2 === 0 ? width : width - TOOTH} ${y}`);
  }
  return `M${points.join(" L")} Z`;
}

function Tape({
  tone,
  seed,
  width = 72,
  height = 24,
  tilt,
  className,
  style,
}: {
  tone?: number;
  seed?: string;
  width?: number;
  height?: number;
  tilt?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const seedNumber = seed ? hashSeed(seed) : 0;
  const resolvedTone = tone ?? seedNumber % 5;
  const resolvedTilt = tilt ?? (seed ? (seedNumber % 2 === 0 ? 6 : -6) : -4);
  const { ref, onLayout, progress } = useReveal(180);
  const popStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 0.4], [0, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(progress.get(), [0, 1], [0.4, 1]) }],
  }));
  const clipId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const path = useMemo(() => tapePath(width, height), [width, height]);
  const stripes: number[] = [];
  for (let x = -height; x < width; x += 8) {
    stripes.push(x);
  }
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
        <View style={{ transform: [{ rotate: `${resolvedTilt}deg` }] }}>
          <Svg width={width} height={height}>
            <Defs>
              <ClipPath id={clipId}>
                <Path d={path} />
              </ClipPath>
            </Defs>
            <Path
              d={path}
              fill={TONES[resolvedTone % TONES.length]}
              fillOpacity={0.88}
            />
            {stripes.map((x) => (
              <Line
                key={x}
                x1={x}
                y1={height}
                x2={x + height}
                y2={0}
                stroke={STICK.ink}
                strokeOpacity={0.12}
                strokeWidth={2}
                clipPath={`url(#${clipId})`}
              />
            ))}
            <Path
              d={path}
              fill="none"
              stroke={STICK.ink}
              strokeOpacity={0.45}
              strokeWidth={1}
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
}

export { Tape };

import { useId } from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, Line, Pattern, Rect } from "react-native-svg";
import { usePalette } from "@/components/scrapbook/use-paper";
import { Space } from "@/theme/space";

type PatternVariant = "dots" | "grid" | "diagonal";

const OPACITY: Record<PatternVariant, number> = {
  dots: 0.14,
  grid: 0.07,
  diagonal: 0.1,
};

function PatternBackground({
  variant = "dots",
  size = Space.lg,
  opacity,
}: {
  variant?: PatternVariant;
  size?: number;
  opacity?: number;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const color = usePalette().foreground;
  const alpha = opacity ?? OPACITY[variant];
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="absolute inset-0 overflow-hidden"
    >
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id={id}
            patternUnits="userSpaceOnUse"
            width={size}
            height={size}
          >
            {variant === "dots" ? (
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={Space.xs / 2 + 0.5}
                fill={color}
                fillOpacity={alpha}
              />
            ) : null}
            {variant === "grid" ? (
              <>
                <Line
                  x1={0}
                  y1={0}
                  x2={size}
                  y2={0}
                  stroke={color}
                  strokeOpacity={alpha}
                  strokeWidth={1}
                />
                <Line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={size}
                  stroke={color}
                  strokeOpacity={alpha}
                  strokeWidth={1}
                />
              </>
            ) : null}
            {variant === "diagonal" ? (
              <Line
                x1={0}
                y1={size}
                x2={size}
                y2={0}
                stroke={color}
                strokeOpacity={alpha}
                strokeWidth={Space.xs}
              />
            ) : null}
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

export { PatternBackground };
export type { PatternVariant };

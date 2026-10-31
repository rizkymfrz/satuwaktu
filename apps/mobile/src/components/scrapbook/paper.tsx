import {
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, ClipPath, Defs, G, Line, Path } from "react-native-svg";
import {
  LINE_HEIGHT,
  PAPER_BORDER,
  PAPER_RADIUS,
  PAPER_SHADOW,
  TORN_AMPLITUDE,
  type PaperColors,
} from "@/components/scrapbook/constants";
import { usePaper } from "@/components/scrapbook/use-paper";
import {
  hashSeed,
  paperPath,
  seededRng,
  type TornEdge,
} from "@/components/scrapbook/utils";
import { cn } from "@/lib/utils";

type PaperVariant = "plain" | "kraft" | "lined" | "grid" | "note";
type Bleed = { top?: number; right?: number; bottom?: number; left?: number };

type PaperProps = {
  lineStart?: number;
  bleed?: Bleed;
  variant?: PaperVariant;
  torn?: TornEdge;
  seed?: string;
  tilt?: number;
  shadow?: boolean;
  pressed?: boolean;
  className?: string;
  contentClassName?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

function Texture({
  variant,
  width,
  height,
  seed,
  lineStart,
  colors,
}: {
  colors: PaperColors;
  variant: PaperVariant;
  width: number;
  height: number;
  seed: number;
  lineStart: number;
}) {
  return useMemo(() => {
    const rng = seededRng(seed + 7);
    const nodes: ReactElement[] = [];
    if (variant === "kraft" || variant === "plain") {
      const density = variant === "kraft" ? 700 : 2400;
      const count = Math.min(160, Math.round((width * height) / density));
      for (let index = 0; index < count; index += 1) {
        const x = rng() * width;
        const y = rng() * height;
        if (rng() > 0.35) {
          nodes.push(
            <Circle
              key={`s${index}`}
              cx={x}
              cy={y}
              r={0.5 + rng() * 0.9}
              fill={colors.kraftSpeck}
              fillOpacity={0.18 + rng() * 0.3}
            />,
          );
        } else {
          const angle = rng() * Math.PI;
          const length = 4 + rng() * 8;
          nodes.push(
            <Line
              key={`f${index}`}
              x1={x}
              y1={y}
              x2={x + Math.cos(angle) * length}
              y2={y + Math.sin(angle) * length}
              stroke={colors.kraftSpeck}
              strokeOpacity={0.14 + rng() * 0.16}
              strokeWidth={1}
              strokeLinecap="round"
            />,
          );
        }
      }
    }
    if (variant === "lined") {
      for (let y = lineStart + LINE_HEIGHT - 2; y < height; y += LINE_HEIGHT) {
        nodes.push(
          <Line
            key={`l${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={colors.ink}
            strokeOpacity={0.14}
            strokeWidth={1}
          />,
        );
      }
    }
    if (variant === "grid") {
      for (let y = 16; y < height; y += 16) {
        nodes.push(
          <Line
            key={`h${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={colors.ink}
            strokeOpacity={0.1}
            strokeWidth={1}
          />,
        );
      }
      for (let x = 16; x < width; x += 16) {
        nodes.push(
          <Line
            key={`v${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke={colors.ink}
            strokeOpacity={0.1}
            strokeWidth={1}
          />,
        );
      }
    }
    return <>{nodes}</>;
  }, [variant, width, height, seed, lineStart, colors]);
}

function Paper({
  variant = "plain",
  torn = "none",
  seed = "paper",
  tilt = 0,
  shadow = true,
  pressed = false,
  lineStart = 16,
  bleed,
  className,
  contentClassName,
  style,
  children,
}: PaperProps) {
  const colors = usePaper();
  const fills: Record<PaperVariant, string> = {
    plain: colors.cream,
    kraft: colors.kraft,
    lined: colors.cream,
    grid: colors.cream,
    note: colors.note,
  };
  const [size, setSize] = useState({ width: 0, height: 0 });
  const clipId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const seedNumber = useMemo(() => hashSeed(seed), [seed]);
  const tornTop = torn === "top" || torn === "both";
  const tornBottom = torn === "bottom" || torn === "both";
  const bleedTop = bleed?.top ?? 0;
  const bleedRight = bleed?.right ?? 0;
  const bleedBottom = bleed?.bottom ?? 0;
  const bleedLeft = bleed?.left ?? 0;
  const artWidth = size.width + bleedLeft + bleedRight;
  const artHeight = size.height + bleedTop + bleedBottom;
  const path = useMemo(
    () =>
      size.width > 0
        ? paperPath({
            width: artWidth,
            height: artHeight,
            torn,
            seed: seedNumber,
            inset: PAPER_BORDER / 2,
            amplitude: TORN_AMPLITUDE,
            step: 10,
            radius: PAPER_RADIUS,
          })
        : "",
    [size.width, artWidth, artHeight, torn, seedNumber],
  );
  return (
    <View
      className={className}
      style={[
        {
          transform: [
            { rotate: `${tilt}deg` },
            { translateX: pressed ? PAPER_SHADOW : 0 },
            { translateY: pressed ? PAPER_SHADOW : 0 },
          ],
        },
        style,
      ]}
      onLayout={(event) =>
        setSize({
          width: Math.round(event.nativeEvent.layout.width),
          height: Math.round(event.nativeEvent.layout.height),
        })
      }
    >
      {!path ? (
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            position: "absolute",
            left: -bleedLeft,
            top: -bleedTop,
            right: -bleedRight,
            bottom: -bleedBottom,
            backgroundColor: fills[variant],
            borderColor: colors.ink,
            borderWidth: PAPER_BORDER,
            borderRadius: PAPER_RADIUS,
          }}
        />
      ) : (
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="absolute"
          style={{ overflow: "visible", left: -bleedLeft, top: -bleedTop }}
        >
          <Svg
            width={artWidth + PAPER_SHADOW}
            height={artHeight + PAPER_SHADOW}
            style={{ overflow: "visible" }}
          >
            <Defs>
              <ClipPath id={clipId}>
                <Path d={path} />
              </ClipPath>
            </Defs>
            {shadow && !pressed ? (
              <G x={PAPER_SHADOW} y={PAPER_SHADOW}>
                <Path d={path} fill={colors.ink} />
              </G>
            ) : null}
            <Path d={path} fill={fills[variant]} />
            <G clipPath={`url(#${clipId})`}>
              <Texture
                variant={variant}
                width={artWidth}
                height={artHeight}
                seed={seedNumber}
                colors={colors}
                lineStart={
                  lineStart + bleedTop + (tornTop ? TORN_AMPLITUDE : 0)
                }
              />
            </G>
            <Path
              d={path}
              fill="none"
              stroke={colors.ink}
              strokeWidth={PAPER_BORDER}
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      )}
      <View
        style={{
          paddingTop: tornTop ? TORN_AMPLITUDE : 0,
          paddingBottom: tornBottom ? TORN_AMPLITUDE : 0,
        }}
      >
        <View className={cn("p-4", contentClassName)}>{children}</View>
      </View>
    </View>
  );
}

export { Paper };
export type { PaperProps, PaperVariant };

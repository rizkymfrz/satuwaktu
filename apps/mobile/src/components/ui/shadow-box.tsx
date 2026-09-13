import { cn } from "@/lib/utils";
import { Platform, View, type ViewProps } from "react-native";

const SHADOW_OFFSET = {
  xs: 1,
  sm: 2,
  default: 3,
  md: 4,
  lg: 6,
  xl: 10,
  "2xl": 16,
} as const;

type ShadowSize = keyof typeof SHADOW_OFFSET;

const WEB_SHADOW_CLASS: Record<ShadowSize, string> = {
  xs: "shadow-xs",
  sm: "shadow-sm",
  default: "shadow",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};

const WEB_PRESSED_TRANSLATE_CLASS: Record<ShadowSize, string> = {
  xs: "translate-x-px translate-y-px",
  sm: "translate-x-0.5 translate-y-0.5",
  default: "translate-x-1 translate-y-1",
  md: "translate-x-1 translate-y-1",
  lg: "translate-x-1.5 translate-y-1.5",
  xl: "translate-x-2.5 translate-y-2.5",
  "2xl": "translate-x-4 translate-y-4",
};

type ShadowBoxProps = Omit<ViewProps, "className"> & {
  size?: ShadowSize;
  pressed?: boolean;
  className?: string;
  contentClassName?: string;
  shadowClassName?: string;
};

function ShadowBox({
  size = "default",
  pressed = false,
  className,
  contentClassName,
  shadowClassName,
  style,
  children,
  ...props
}: ShadowBoxProps) {
  if (Platform.OS === "web") {
    return (
      <View
        className={cn(
          "transition-transform duration-100",
          pressed
            ? cn("shadow-none", WEB_PRESSED_TRANSLATE_CLASS[size])
            : cn(WEB_SHADOW_CLASS[size], "translate-x-0 translate-y-0"),
          className,
          contentClassName,
        )}
        style={style}
        {...props}
      >
        {children}
      </View>
    );
  }

  const offset = SHADOW_OFFSET[size];

  return (
    <View className={cn("relative", className)}>
      <View
        pointerEvents="none"
        className={cn("absolute bg-border", shadowClassName)}
        style={{
          top: offset,
          left: offset,
          width: "100%",
          height: "100%",
          elevation: 0,
        }}
      />
      <View
        className={cn(contentClassName)}
        style={[
          {
            elevation: 0,
            transform: [
              { translateX: pressed ? offset : 0 },
              { translateY: pressed ? offset : 0 },
            ],
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </View>
  );
}

export { ShadowBox };
export type { ShadowBoxProps, ShadowSize };

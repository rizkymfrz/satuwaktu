import type { VariantProps } from "class-variance-authority";
import { createContext, useContext, type ComponentProps } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type PressableStateCallbackType,
} from "react-native";
import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type ToggleGroupOrientation = "horizontal" | "vertical";

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  spacing: number;
  orientation: ToggleGroupOrientation;
};

const SPACING_UNIT = 4;

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
  spacing: 2,
  orientation: "horizontal",
});

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 2,
  orientation = "horizontal",
  children,
  style,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: ToggleGroupOrientation;
  }) {
  const joined = spacing === 0;
  const horizontal = orientation === "horizontal";
  const root = (
    <ToggleGroupPrimitive.Root
      className={cn(
        "items-center",
        horizontal ? "flex-row" : "flex-col items-stretch",
        joined ? (horizontal ? "-mr-0.5" : "-mb-0.5") : "mb-1 mr-1 self-start",
        Platform.select({ web: "w-fit" }),
        className,
      )}
      style={StyleSheet.flatten([
        joined ? null : { gap: spacing * SPACING_UNIT },
        style,
      ])}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
  if (!joined) {
    return root;
  }
  return (
    <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
      <ShadowBox
        size="md"
        className="mb-1 mr-1"
        contentClassName="overflow-hidden rounded-md border-2 border-border bg-background"
      >
        {root}
      </ShadowBox>
    </View>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = useContext(ToggleGroupContext);
  const { value } = ToggleGroupPrimitive.useRootContext();
  const selected = ToggleGroupPrimitive.utils.getIsSelected(value, props.value);
  const joined = context.spacing === 0;
  const horizontal = context.orientation === "horizontal";
  const contentClassName = cn(
    toggleVariants({
      variant: context.variant || variant,
      size: context.size || size,
    }),
    selected ? "bg-primary" : "bg-background",
    joined &&
      cn(
        "rounded-none border-0",
        horizontal ? "border-r-2" : "border-b-2",
        !horizontal && "w-full",
      ),
    className,
  );
  return (
    <TextClassContext.Provider
      value={cn(
        "font-head text-sm font-medium",
        selected ? "text-primary-foreground" : "text-foreground",
      )}
    >
      <ToggleGroupPrimitive.Item
        className={cn(
          "group shrink-0",
          props.disabled && "opacity-50",
          Platform.select({ web: "focus:z-10 focus-visible:z-10" }),
        )}
        {...props}
      >
        {(state: PressableStateCallbackType) => {
          const content =
            typeof children === "function" ? children(state) : children;
          return joined ? (
            <View className={contentClassName}>
              <>{content}</>
            </View>
          ) : (
            <ShadowBox
              size="md"
              pressed={state.pressed}
              contentClassName={contentClassName}
            >
              <>{content}</>
            </ShadowBox>
          );
        }}
      </ToggleGroupPrimitive.Item>
    </TextClassContext.Provider>
  );
}

function ToggleGroupIcon({ className, ...props }: ComponentProps<typeof Icon>) {
  const textClass = useContext(TextClassContext);
  return (
    <Icon className={cn("size-4 shrink-0", textClass, className)} {...props} />
  );
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem };

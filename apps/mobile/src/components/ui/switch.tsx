import type { ComponentProps } from "react";
import { Platform } from "react-native";
import * as SwitchPrimitives from "@rn-primitives/switch";
import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: ComponentProps<typeof SwitchPrimitives.Root> & {
  size?: "default" | "sm";
}) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        "flex shrink-0 flex-row items-center border-2 border-foreground",
        size === "sm" ? "h-5 w-9" : "h-6 w-11",
        Platform.select({
          web: "peer inline-flex cursor-pointer outline-none transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
        }),
        props.checked ? "bg-primary" : "bg-transparent",
        props.disabled && "opacity-50",
        className,
      )}
      hitSlop={8}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "mx-0.5 border-2 border-foreground transition-transform",
          size === "sm" ? "size-3" : "size-4",
          Platform.select({
            web: "pointer-events-none block",
          }),
          props.checked
            ? cn(
                "bg-background",
                size === "sm" ? "translate-x-4" : "translate-x-5",
              )
            : "translate-x-0 bg-primary",
        )}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };

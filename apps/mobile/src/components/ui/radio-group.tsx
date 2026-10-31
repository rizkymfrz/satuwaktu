import type { ComponentProps } from "react";
import { Platform } from "react-native";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import { ShadowBox } from "@/components/ui/shadow-box";
import { cn } from "@/lib/utils";

const DEFAULT_HIT_SLOP = 12;

function RadioGroup({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("w-full gap-2", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "shrink-0 self-start",
        Platform.select({
          web: "peer cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
        }),
        props.disabled && "opacity-50",
      )}
      hitSlop={DEFAULT_HIT_SLOP}
      {...props}
    >
      <ShadowBox
        size="md"
        circle
        contentClassName={cn(
          "size-5 items-center justify-center rounded-full border-2 border-border bg-input",
          className,
        )}
      >
        <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-primary" />
      </ShadowBox>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };

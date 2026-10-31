import { Check } from "lucide-react-native";
import type { ComponentProps } from "react";
import { Platform } from "react-native";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { cn } from "@/lib/utils";

const DEFAULT_HIT_SLOP = 24;

function Checkbox({
  className,
  checkedClassName,
  indicatorClassName,
  iconClassName,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> & {
  checkedClassName?: string;
  indicatorClassName?: string;
  iconClassName?: string;
}) {
  return (
    <CheckboxPrimitive.Root
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
        contentClassName={cn(
          "size-5 items-center justify-center rounded border-2 border-border bg-input",
          props.checked && cn("border-border bg-primary", checkedClassName),
          className,
        )}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            "size-full items-center justify-center",
            indicatorClassName,
          )}
        >
          <Icon
            as={Check}
            size={12}
            strokeWidth={Platform.OS === "web" ? 2.5 : 3.5}
            className={cn("text-primary-foreground", iconClassName)}
          />
        </CheckboxPrimitive.Indicator>
      </ShadowBox>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

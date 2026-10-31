import type { ComponentProps } from "react";
import * as SeparatorPrimitive from "@rn-primitives/separator";
import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal"
          ? "h-[1px] w-full"
          : "w-[1px] self-stretch",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };

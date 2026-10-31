import type { ComponentProps, RefAttributes } from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: ComponentProps<typeof View> & RefAttributes<View>) {
  return (
    <View
      className={cn(
        "animate-pulse rounded-md border-2 border-border bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };

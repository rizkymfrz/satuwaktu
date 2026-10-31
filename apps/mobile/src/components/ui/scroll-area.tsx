import type { ComponentProps } from "react";
import { ScrollView, View } from "react-native";
import { cn } from "@/lib/utils";

type ScrollAreaProps = Omit<ComponentProps<typeof ScrollView>, "horizontal"> & {
  orientation?: "vertical" | "horizontal" | "both";
  contentClassName?: string;
};

function ScrollArea({
  className,
  contentClassName,
  orientation = "vertical",
  children,
  ...props
}: ScrollAreaProps) {
  const horizontal = orientation === "horizontal";
  if (orientation === "both") {
    return (
      <ScrollView
        nestedScrollEnabled
        className={cn("relative", className)}
        {...props}
      >
        <ScrollView
          horizontal
          nestedScrollEnabled
          contentContainerClassName={contentClassName}
        >
          <View>{children}</View>
        </ScrollView>
      </ScrollView>
    );
  }
  return (
    <ScrollView
      horizontal={horizontal}
      nestedScrollEnabled
      className={cn("relative", className)}
      contentContainerClassName={contentClassName}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export { ScrollArea };
export type { ScrollAreaProps };

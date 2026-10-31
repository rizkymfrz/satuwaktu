import { Children, type ReactNode } from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

function ButtonRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <View className={cn("flex-row gap-4", className)}>
      {Children.toArray(children).map((child, index) => (
        <View key={index} className="flex-1">
          {child}
        </View>
      ))}
    </View>
  );
}

export { ButtonRow };

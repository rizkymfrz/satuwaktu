import { View, type ViewProps } from "react-native";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function Kbd({ className, children, ...props }: ViewProps) {
  return (
    <ShadowBox
      size="md"
      className="mb-1 mr-1 self-start"
      contentClassName={cn(
        "h-5 min-w-5 flex-row items-center justify-center gap-1 rounded-md border-2 border-border bg-muted",
        className,
      )}
      style={{ paddingHorizontal: 6 }}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="font-mono text-xs font-medium text-muted-foreground">
          {children}
        </Text>
      ) : (
        children
      )}
    </ShadowBox>
  );
}

function KbdGroup({ className, ...props }: ViewProps) {
  return (
    <View className={cn("flex-row items-center gap-1", className)} {...props} />
  );
}

export { Kbd, KbdGroup };

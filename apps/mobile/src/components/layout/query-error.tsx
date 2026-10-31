import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

function QueryError({
  message,
  onRetry,
  fill = false,
  className,
}: {
  message: string;
  onRetry: () => void;
  fill?: boolean;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "items-center gap-4",
        fill && "flex-1 justify-center px-4",
        className,
      )}
    >
      <TypographyMuted>{message}</TypographyMuted>
      <Button variant="outline" onPress={onRetry}>
        <Text>Coba lagi</Text>
      </Button>
    </View>
  );
}

export { QueryError };

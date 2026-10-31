import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TypographyMuted } from "@/components/ui/typography";

const DEFAULT_MESSAGE =
  "Peta tidak bisa dimuat. Periksa koneksi internet, lalu coba lagi.";

function MapError({
  onRetry,
  message = DEFAULT_MESSAGE,
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <View className="absolute inset-0 items-center justify-center gap-4 bg-background p-8">
      <TypographyMuted className="text-center text-base">
        {message}
      </TypographyMuted>
      <Button variant="outline" onPress={onRetry}>
        <Text>Coba lagi</Text>
      </Button>
    </View>
  );
}

export { MapError };

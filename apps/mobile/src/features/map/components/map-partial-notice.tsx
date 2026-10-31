import { View } from "react-native";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TypographyMuted } from "@/components/ui/typography";

function MapPartialNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="absolute inset-x-0 bottom-8 px-4" pointerEvents="box-none">
      <TapedPaper
        tape="center"
        seed="peta-sebagian"
        contentClassName="items-center gap-4 p-4"
      >
        <TypographyMuted className="text-center text-base">
          Sebagian lokasi belum termuat.
        </TypographyMuted>
        <Button variant="outline" onPress={onRetry}>
          <Text>Coba lagi</Text>
        </Button>
      </TapedPaper>
    </View>
  );
}

export { MapPartialNotice };

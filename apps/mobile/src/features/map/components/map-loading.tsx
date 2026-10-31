import { View } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { TypographyMuted } from "@/components/ui/typography";

function MapLoading() {
  return (
    <View className="absolute inset-0 items-center justify-center gap-2 bg-background">
      <Spinner size={28} />
      <TypographyMuted>Memuat peta…</TypographyMuted>
    </View>
  );
}

export { MapLoading };

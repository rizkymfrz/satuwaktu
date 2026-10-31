import { useRouter } from "expo-router";
import { View } from "react-native";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TypographyMuted } from "@/components/ui/typography";
import { useSession } from "@/features/session/store";

function MapEmptyCard({
  chapter,
  noLocations,
  onResetFilter,
}: {
  chapter: string | null;
  noLocations: boolean;
  onResetFilter: () => void;
}) {
  const router = useRouter();
  const { role } = useSession();
  return (
    <View className="absolute inset-x-0 bottom-8 px-4" pointerEvents="box-none">
      <TapedPaper
        tape="center"
        seed="peta-kosong"
        contentClassName="items-center gap-4 p-4"
      >
        <TypographyMuted className="text-center text-base">
          {chapter && !noLocations
            ? "Belum ada fragmen bertitik di babak ini."
            : "Belum ada fragmen yang menandai tempatnya."}
        </TypographyMuted>
        {chapter ? (
          <Button variant="outline" onPress={onResetFilter}>
            <Text>Atur ulang filter</Text>
          </Button>
        ) : role === "owner" ? (
          <Button onPress={() => router.push("/fragments/new")}>
            <Text>Abadikan dengan lokasi</Text>
          </Button>
        ) : null}
      </TapedPaper>
    </View>
  );
}

export { MapEmptyCard };

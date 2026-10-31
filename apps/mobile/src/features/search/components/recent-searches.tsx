import { Clock, X } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TypographyH4, TypographySmall } from "@/components/ui/typography";

function RecentSearches({
  terms,
  onSelect,
  onRemove,
  onClear,
}: {
  terms: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
  onClear: () => void;
}) {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <TypographyH4 className="font-head">Pencarian terakhir</TypographyH4>
        <Button variant="link" size="xs" hitSlop={8} onPress={onClear}>
          <Text>Hapus semua</Text>
        </Button>
      </View>
      <TapedPaper
        tape="left"
        variant="lined"
        seed="pencarian-terakhir"
        contentClassName="p-4"
      >
        {terms.map((term) => (
          <View key={term} className="h-12 flex-row items-end gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Cari ${term}`}
              onPress={() => onSelect(term)}
              className="flex-1 flex-row items-end gap-4 active:opacity-70"
            >
              <Icon as={Clock} size={16} className="mb-1" />
              <TypographySmall
                numberOfLines={1}
                className="flex-1 text-base leading-6"
              >
                {term}
              </TypographySmall>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Hapus ${term} dari riwayat`}
              hitSlop={8}
              onPress={() => onRemove(term)}
              className="mb-1 active:opacity-70"
            >
              <Icon as={X} size={16} />
            </Pressable>
          </View>
        ))}
      </TapedPaper>
    </View>
  );
}

export { RecentSearches };

import { useRouter } from "expo-router";
import { FolderOpen, Images } from "lucide-react-native";
import { View } from "react-native";
import { EmptyState } from "@/components/layout/empty-state";
import { MasonryGrid } from "@/components/layout/masonry-grid";
import { Enter } from "@/components/motion/enter";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FragmentTile } from "@/features/archive/components/fragment-tile";
import { StatCell } from "@/features/home/components/stat-cell";
import { heightOf, type GridItem } from "@/features/home/feed";
import type { StatKind } from "@/features/home/types";
import { useSession } from "@/features/session/store";

function FeedGrid({
  items,
  stats,
  archiveEmpty,
  filterEmpty,
  onOpenFragment,
  onResetFilter,
}: {
  items: GridItem[];
  stats: Record<StatKind, number>;
  archiveEmpty: boolean;
  filterEmpty: boolean;
  onOpenFragment: (id: string) => void;
  onResetFilter: () => void;
}) {
  const router = useRouter();
  const { role } = useSession();
  return (
    <View className="px-4">
      {archiveEmpty ? (
        <EmptyState
          icon={Images}
          title="Arsip masih sunyi"
          className="py-8"
          action={
            role === "owner" ? (
              <Button onPress={() => router.push("/fragments/new")}>
                <Text>Abadikan fragmen pertama</Text>
              </Button>
            ) : null
          }
        >
          {role === "guest"
            ? "Belum ada kenangan yang dibagikan."
            : "Belum ada fragmen yang tersimpan."}
        </EmptyState>
      ) : filterEmpty ? (
        <EmptyState
          icon={FolderOpen}
          title="Babak ini masih lengang"
          className="py-8"
          action={
            <Button variant="outline" onPress={onResetFilter}>
              <Text>Atur ulang filter</Text>
            </Button>
          }
        >
          Belum ada fragmen di babak ini. Coba babak lain atau lepas filternya.
        </EmptyState>
      ) : (
        <MasonryGrid
          items={items}
          heightOf={heightOf}
          keyOf={(item) =>
            item.type === "fragment" ? item.fragment.id : item.key
          }
          renderItem={(item, columnWidth, slot) =>
            item.type === "fragment" ? (
              <Enter index={slot}>
                <FragmentTile
                  fragment={item.fragment}
                  width={columnWidth}
                  onOpen={() => onOpenFragment(item.fragment.id)}
                />
              </Enter>
            ) : (
              <Enter index={slot}>
                <StatCell
                  kind={item.kind}
                  value={stats[item.kind]}
                  width={columnWidth}
                  index={slot}
                />
              </Enter>
            )
          }
        />
      )}
    </View>
  );
}

export { FeedGrid };

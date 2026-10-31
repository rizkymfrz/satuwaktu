import { Fragment, useMemo, type ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";
import { Space } from "@/theme/space";

const GRID_GAP = Space.lg;
const PADDING = Space.lg;

function useColumnWidth() {
  const { width } = useWindowDimensions();
  return Math.floor((width - PADDING * 2 - GRID_GAP) / 2);
}

function MasonryGrid<T>({
  items,
  heightOf,
  keyOf,
  renderItem,
}: {
  items: T[];
  heightOf: (item: T, columnWidth: number) => number;
  keyOf: (item: T) => string;
  renderItem: (item: T, columnWidth: number, slot: number) => ReactNode;
}) {
  const columnWidth = useColumnWidth();
  const columns = useMemo(() => {
    const cols: { items: { item: T; slot: number }[]; height: number }[] = [
      { items: [], height: 0 },
      { items: [], height: 0 },
    ];
    items.forEach((item, index) => {
      const target = cols[0].height <= cols[1].height ? cols[0] : cols[1];
      target.items.push({ item, slot: index });
      target.height += heightOf(item, columnWidth) + GRID_GAP;
    });
    return cols;
  }, [items, columnWidth, heightOf]);
  return (
    <View className="flex-row" style={{ gap: GRID_GAP }}>
      {columns.map((column, columnIndex) => (
        <View key={columnIndex} style={{ gap: GRID_GAP, width: columnWidth }}>
          {column.items.map(({ item, slot }) => (
            <Fragment key={keyOf(item)}>
              {renderItem(item, columnWidth, slot)}
            </Fragment>
          ))}
        </View>
      ))}
    </View>
  );
}

export { MasonryGrid, useColumnWidth };

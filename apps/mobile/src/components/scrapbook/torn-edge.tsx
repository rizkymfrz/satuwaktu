import { useMemo, useState } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { PAPER_BORDER } from "@/components/scrapbook/constants";
import { usePaper } from "@/components/scrapbook/use-paper";
import { hashSeed, seededRng } from "@/components/scrapbook/utils";
import { Space } from "@/theme/space";

const EDGE_HEIGHT = Space.lg;
const AMPLITUDE = 8;
const STEP = 10;

function TornEdge({ seed = "edge", fill }: { seed?: string; fill?: string }) {
  const paper = usePaper();
  const [width, setWidth] = useState(0);
  const paths = useMemo(() => {
    if (width === 0) {
      return null;
    }
    const rng = seededRng(hashSeed(seed));
    const count = Math.max(2, Math.round(width / STEP));
    const points = Array.from({ length: count + 1 }, (_, index) => {
      const x = (width * index) / count;
      const y = PAPER_BORDER + rng() * AMPLITUDE;
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    });
    const line = `M${points.join(" L")}`;
    return {
      line,
      area: `${line} L${width} ${EDGE_HEIGHT} L0 ${EDGE_HEIGHT} Z`,
    };
  }, [width, seed]);
  return (
    <View
      pointerEvents="none"
      onLayout={(event) => setWidth(Math.round(event.nativeEvent.layout.width))}
      style={{ height: EDGE_HEIGHT }}
    >
      {paths ? (
        <Svg width={width} height={EDGE_HEIGHT}>
          <Path d={paths.area} fill={fill ?? paper.kraft} />
          <Path
            d={paths.line}
            fill="none"
            stroke={paper.ink}
            strokeWidth={PAPER_BORDER}
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}
    </View>
  );
}

export { TornEdge };

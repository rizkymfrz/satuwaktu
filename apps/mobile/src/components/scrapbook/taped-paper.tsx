import { View } from "react-native";
import { Paper, type PaperProps } from "@/components/scrapbook/paper";
import { Tape } from "@/components/scrapbook/tape";
import { pressShift } from "@/components/scrapbook/utils";
import { cn } from "@/lib/utils";

type TapePlacement = "left" | "center" | "right";

const PLACEMENT: Record<TapePlacement, string> = {
  left: "absolute -top-2 left-4",
  center: "absolute -top-2 self-center",
  right: "absolute -top-2 right-8",
};

function TapedPaper({
  tape = "right",
  tapeSeed,
  tapeWidth = 56,
  tapeHeight = 20,
  className,
  seed = "paper",
  ...paper
}: Omit<PaperProps, "className"> & {
  tape?: TapePlacement;
  tapeSeed?: string;
  tapeWidth?: number;
  tapeHeight?: number;
  className?: string;
}) {
  return (
    <View className={cn("pr-1", className)}>
      <Paper seed={seed} {...paper} />
      <Tape
        seed={tapeSeed ?? seed}
        width={tapeWidth}
        height={tapeHeight}
        className={PLACEMENT[tape]}
        style={pressShift(paper.pressed ?? false)}
      />
    </View>
  );
}

export { TapedPaper };

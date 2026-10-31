import { View } from "react-native";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type ProgressStep = { label: string; done: boolean };

function FormProgress({ steps }: { steps: ProgressStep[] }) {
  const done = steps.filter((step) => step.done).length;
  const missing = steps.filter((step) => !step.done).map((step) => step.label);
  return (
    <View
      className="gap-2"
      accessibilityRole="progressbar"
      accessibilityLabel="Kelengkapan fragmen"
      accessibilityValue={{ min: 0, max: steps.length, now: done }}
    >
      <View className="flex-row items-center justify-between">
        <TypographySmall className="text-base">Kelengkapan</TypographySmall>
        <TypographyMuted className="text-xs">
          {done}/{steps.length} terisi
        </TypographyMuted>
      </View>
      <View className="flex-row gap-2">
        {steps.map((step) => (
          <View
            key={step.label}
            className={cn(
              "h-2 flex-1 rounded-full border border-border",
              step.done ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </View>
      <TypographyMuted className="text-xs">
        {missing.length === 0
          ? "Semua bagian sudah terisi."
          : `Belum: ${missing.join(", ")}`}
      </TypographyMuted>
    </View>
  );
}

export { FormProgress };
export type { ProgressStep };

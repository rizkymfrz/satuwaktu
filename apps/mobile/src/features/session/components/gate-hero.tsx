import { View } from "react-native";
import { Paper } from "@/components/scrapbook/paper";
import { Sticker } from "@/components/scrapbook/sticker";
import { Tape } from "@/components/scrapbook/tape";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";

function GateHero() {
  return (
    <View className="pr-1">
      <Paper variant="kraft" torn="bottom" seed="gate" tilt={-1}>
        <View className="gap-2 px-2 py-4">
          <TypographyH1 className="font-head text-left">satuwaktu</TypographyH1>
          <TypographyMuted className="text-base">
            Fragmen yang disimpan berdua. Siapa yang datang mengingat hari ini?
          </TypographyMuted>
        </View>
      </Paper>
      <Tape
        tone={1}
        width={80}
        height={24}
        tilt={-6}
        className="absolute -top-2 left-4"
      />
      <Sticker
        kind="heart"
        tone={4}
        size={40}
        tilt={12}
        className="absolute -bottom-4 right-4"
      />
    </View>
  );
}

export { GateHero };

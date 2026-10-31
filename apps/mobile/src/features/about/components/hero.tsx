import { View } from "react-native";
import { Enter } from "@/components/motion/enter";
import { Paper } from "@/components/scrapbook/paper";
import { Sticker } from "@/components/scrapbook/sticker";
import { Tape } from "@/components/scrapbook/tape";
import {
  TypographyH3,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";

function Hero() {
  return (
    <Enter className="pr-1">
      <Paper variant="kraft" torn="bottom" seed="hero" tilt={-1}>
        <View className="gap-2 px-2 py-4">
          <TypographyH3 className="font-head text-3xl leading-10">
            satuwaktu
          </TypographyH3>
          <TypographyMuted>/sa•tu•wak•tu/ · nomina</TypographyMuted>
          <TypographyP className="mt-0 leading-6">
            Keadaan dimana fragmen hidup berserakan, lalu dirangkai ulang dengan
            rasa, bukan urutan.
          </TypographyP>
          <TypographyP className="mt-0 leading-6">
            Bukan untuk mengulang masa lalu, melainkan untuk mengingat bahwa
            kita pernah ada di satuwaktu yang nyaris tak disengaja.
          </TypographyP>
        </View>
      </Paper>
      <Tape
        tone={1}
        width={80}
        height={24}
        tilt={-6}
        className="absolute -top-2 left-4"
      />
      <Tape
        tone={3}
        width={64}
        height={24}
        tilt={5}
        className="absolute -top-2 right-8"
      />
      <Sticker
        kind="heart"
        tone={4}
        size={40}
        tilt={12}
        className="absolute -bottom-4 right-4"
      />
    </Enter>
  );
}

export { Hero };

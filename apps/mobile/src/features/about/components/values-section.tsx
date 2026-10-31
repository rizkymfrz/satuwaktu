import {
  History,
  Puzzle,
  Sparkles,
  type LucideIcon,
} from "lucide-react-native";
import { View } from "react-native";
import { Enter } from "@/components/motion/enter";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Icon } from "@/components/ui/icon";
import {
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/components/ui/typography";
import { TONES } from "@/theme/tones";

const VALUES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Puzzle,
    title: "Berserakan, lalu dirangkai",
    description:
      "Tak ada urutan yang harus dipatuhi. Kepingan ditata menurut rasa, bukan menurut waktu.",
  },
  {
    icon: History,
    title: "Bukan untuk kembali",
    description:
      "Kami tak sedang mengulang masa lalu, hanya mengingat bahwa kita pernah ada di sana.",
  },
  {
    icon: Sparkles,
    title: "Nyaris tak disengaja",
    description:
      "Yang paling berharga sering datang tanpa rencana, dan baru terasa setelah ia berlalu.",
  },
];

function ValuesSection() {
  return (
    <View className="gap-4">
      <TypographyH4 className="font-head">Yang kami genggam</TypographyH4>
      <View className="gap-4">
        {VALUES.map((value, index) => (
          <Enter key={value.title} index={index}>
            <TapedPaper
              tape="right"
              variant="lined"
              seed={value.title}
              tilt={index % 2 === 0 ? 0.8 : -0.8}
              contentClassName="flex-row items-start gap-4 p-4"
            >
              <View
                className="size-12 items-center justify-center rounded-md border-2 border-border"
                style={{ backgroundColor: TONES[(index + 1) % TONES.length] }}
              >
                <Icon
                  as={value.icon}
                  size={20}
                  className="text-primary-foreground"
                />
              </View>
              <View className="flex-1">
                <TypographySmall className="text-base leading-6">
                  {value.title}
                </TypographySmall>
                <TypographyMuted className="leading-6">
                  {value.description}
                </TypographyMuted>
              </View>
            </TapedPaper>
          </Enter>
        ))}
      </View>
    </View>
  );
}

export { ValuesSection };

import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { Polaroid } from "@/features/archive/components/polaroid";
import type { Fragment } from "@/features/archive/types";
import { TONES } from "@/theme/tones";

type Milestone = {
  key: string;
  title: string;
  meta: string;
  note?: string;
  photos: Fragment[];
};

function JourneyRow({
  milestone,
  index,
  last,
}: {
  milestone: Milestone;
  index: number;
  last: boolean;
}) {
  const router = useRouter();
  const single = milestone.photos.length === 1;
  return (
    <View className="flex-row gap-4">
      <View className="items-center">
        <View
          className="size-8 items-center justify-center rounded-full border-2 border-border"
          style={{ backgroundColor: TONES[index % TONES.length] }}
        >
          <Icon as={Heart} size={14} className="text-primary-foreground" />
        </View>
        {last ? null : <View className="w-0.5 flex-1 bg-border" />}
      </View>
      <View className={last ? "flex-1 gap-1" : "flex-1 gap-1 pb-8"}>
        <TypographySmall className="text-base">
          {milestone.title}
        </TypographySmall>
        <TypographyMuted className="text-xs">{milestone.meta}</TypographyMuted>
        {milestone.note ? (
          <TypographyMuted className="leading-5">
            {milestone.note}
          </TypographyMuted>
        ) : null}
        {milestone.photos.length > 0 ? (
          <View className="mt-2 flex-row gap-4 pr-1">
            {milestone.photos.map((fragment) => (
              <Polaroid
                key={fragment.id}
                fragment={fragment}
                ratio={single ? 4 / 3 : 1}
                caption={single ? fragment.caption : undefined}
                className="flex-1"
                onPress={() =>
                  router.push({
                    pathname: "/fragments/[id]",
                    params: { id: fragment.id },
                  })
                }
              />
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export { JourneyRow };
export type { Milestone };

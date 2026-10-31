import { View } from "react-native";
import { Screen } from "@/components/layout/screen";
import { ScreenScroll } from "@/components/layout/screen-scroll";
import { Sticker } from "@/components/scrapbook/sticker";
import { TypographyMuted } from "@/components/ui/typography";
import { AboutStats } from "@/features/about/components/about-stats";
import { Hero } from "@/features/about/components/hero";
import { JourneySection } from "@/features/about/components/journey-section";
import { OwnersSection } from "@/features/about/components/owners-section";
import { ValuesSection } from "@/features/about/components/values-section";

function AboutScreen() {
  return (
    <Screen title="Tentang kami" back>
      <ScreenScroll contentContainerClassName="gap-8 p-4 pb-8">
        <Hero />
        <AboutStats />
        <OwnersSection />
        <JourneySection />
        <ValuesSection />
        <View className="flex-row items-center justify-center gap-2">
          <Sticker kind="flower" tone={2} size={24} tilt={-10} />
          <TypographyMuted className="text-center text-xs">
            Dirangkai berdua, untuk mengingat berdua.
          </TypographyMuted>
          <Sticker kind="star" tone={3} size={24} tilt={10} />
        </View>
      </ScreenScroll>
    </Screen>
  );
}

export { AboutScreen };

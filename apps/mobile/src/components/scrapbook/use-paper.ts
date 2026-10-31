import { useColorScheme } from "nativewind";
import { paperColors, type Scheme } from "@/components/scrapbook/constants";
import { PALETTE } from "@/theme/palette";

function useScheme(): Scheme {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? "dark" : "light";
}

function usePaper() {
  return paperColors(useScheme());
}

function usePalette() {
  return PALETTE[useScheme()];
}

export { usePalette, usePaper, useScheme };

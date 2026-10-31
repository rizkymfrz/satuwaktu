import { DefaultTheme } from "expo-router";
import { PALETTE } from "@/theme/palette";

const NAVIGATION_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: PALETTE.light.background,
    card: PALETTE.light.background,
    text: PALETTE.light.foreground,
    border: PALETTE.light.border,
    primary: PALETTE.light.primary,
  },
};

export { NAVIGATION_THEME };

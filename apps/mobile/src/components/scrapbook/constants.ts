import { PALETTE } from "@/theme/palette";

type Scheme = "light" | "dark";

const COLORS = {
  light: {
    cream: PALETTE.light.card,
    kraft: PALETTE.light.warning,
    note: PALETTE.light.accent,
    kraftSpeck: PALETTE.light.foreground,
    ink: PALETTE.light.border,
  },
  dark: {
    cream: PALETTE.dark.card,
    kraft: PALETTE.dark.secondary,
    note: PALETTE.dark.muted,
    kraftSpeck: PALETTE.dark.background,
    ink: PALETTE.dark.border,
  },
} as const;

type PaperColors = (typeof COLORS)[Scheme];

function paperColors(scheme: Scheme): PaperColors {
  return COLORS[scheme];
}

const LINE_HEIGHT = 24;
const PAPER_BORDER = 2;
const PAPER_SHADOW = 4;
const PAPER_RADIUS = 4;
const TORN_AMPLITUDE = 8;

export {
  LINE_HEIGHT,
  PAPER_BORDER,
  PAPER_RADIUS,
  PAPER_SHADOW,
  paperColors,
  TORN_AMPLITUDE,
};

export type { PaperColors, Scheme };

import { View } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { PALETTE, type PaletteToken } from "@/theme/palette";

type Token = { name: string; key: PaletteToken; used: number };
type TokenGroup = { title: string; tokens: Token[] };
type OpacityItem = { className: string; token: PaletteToken; used: number };
type OpacityStep = { percent: number; items: OpacityItem[] };

function withAlpha(hex: string, percent: number) {
  return `${hex}${Math.round((percent / 100) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()}`;
}

const TOKEN_GROUPS: TokenGroup[] = [
  {
    title: "Surface",
    tokens: [
      { name: "background", key: "background", used: 19 },
      { name: "foreground", key: "foreground", used: 56 },
      { name: "card", key: "card", used: 16 },
      { name: "card-foreground", key: "cardForeground", used: 1 },
      { name: "popover", key: "popover", used: 40 },
      { name: "popover-foreground", key: "popoverForeground", used: 24 },
      { name: "muted", key: "muted", used: 74 },
      { name: "muted-foreground", key: "mutedForeground", used: 55 },
      { name: "accent", key: "accent", used: 73 },
      { name: "accent-foreground", key: "accentForeground", used: 30 },
    ],
  },
  {
    title: "Brand",
    tokens: [
      { name: "primary", key: "primary", used: 44 },
      { name: "primary-hover", key: "primaryHover", used: 0 },
      { name: "primary-foreground", key: "primaryForeground", used: 10 },
      { name: "secondary", key: "secondary", used: 8 },
      { name: "secondary-foreground", key: "secondaryForeground", used: 4 },
    ],
  },
  {
    title: "Status",
    tokens: [
      { name: "destructive", key: "destructive", used: 46 },
      {
        name: "destructive-foreground",
        key: "destructiveForeground",
        used: 9,
      },
      { name: "success", key: "success", used: 5 },
      { name: "success-foreground", key: "successForeground", used: 3 },
      { name: "warning", key: "warning", used: 5 },
      { name: "warning-foreground", key: "warningForeground", used: 3 },
      { name: "info", key: "info", used: 5 },
      { name: "info-foreground", key: "infoForeground", used: 3 },
    ],
  },
  {
    title: "Border & form",
    tokens: [
      { name: "border", key: "border", used: 92 },
      { name: "input", key: "input", used: 10 },
      { name: "ring", key: "ring", used: 2 },
    ],
  },
];

const OPACITY_STEPS: OpacityStep[] = [
  {
    percent: 10,
    items: [{ className: "bg-destructive/10", token: "destructive", used: 6 }],
  },
  {
    percent: 20,
    items: [
      { className: "bg-destructive/20", token: "destructive", used: 6 },
      { className: "bg-foreground/20", token: "foreground", used: 4 },
      { className: "ring-destructive/20", token: "destructive", used: 1 },
    ],
  },
  {
    percent: 30,
    items: [{ className: "bg-primary/30", token: "primary", used: 3 }],
  },
  {
    percent: 40,
    items: [
      { className: "bg-muted/40", token: "muted", used: 1 },
      { className: "ring-destructive/40", token: "destructive", used: 1 },
    ],
  },
  {
    percent: 50,
    items: [
      { className: "bg-muted/50", token: "muted", used: 5 },
      { className: "ring-ring/50", token: "ring", used: 1 },
    ],
  },
  {
    percent: 60,
    items: [{ className: "text-foreground/60", token: "foreground", used: 1 }],
  },
  {
    percent: 80,
    items: [
      {
        className: "text-destructive-foreground/80",
        token: "destructiveForeground",
        used: 2,
      },
      {
        className: "text-warning-foreground/80",
        token: "warningForeground",
        used: 1,
      },
      {
        className: "text-success-foreground/80",
        token: "successForeground",
        used: 1,
      },
      {
        className: "text-info-foreground/80",
        token: "infoForeground",
        used: 1,
      },
      { className: "text-background/80", token: "background", used: 1 },
    ],
  },
  {
    percent: 90,
    items: [
      { className: "bg-primary/90", token: "primary", used: 1 },
      { className: "bg-secondary/90", token: "secondary", used: 1 },
      { className: "bg-destructive/90", token: "destructive", used: 1 },
    ],
  },
];

const ELEMENT_OPACITY = [
  {
    value: "opacity-50",
    note: "Disabled state: Label, Input, Textarea, InputOTP, InputGroup, Checkbox, RadioGroup, Switch, Slider, Select, Combobox, Command, Calendar, Tabs, Toggle, ToggleGroup, ContextMenu, DropdownMenu, Menubar",
    used: "30×",
  },
  {
    value: "opacity-60",
    note: "Disabled Button, Calendar days outside the month",
    used: "2×",
  },
  {
    value: "0.25 / 0.4",
    note: "Pressed overlay on grouped Button (inline)",
    used: "inline",
  },
  {
    value: "0 / 1",
    note: "ShadowBox shadow while pressed (inline)",
    used: "inline",
  },
];

const COLOR_OPACITY_USAGE = [
  {
    value: "bg-destructive/10",
    note: "Destructive item focus and active: ContextMenu, DropdownMenu, Menubar",
    used: "6×",
  },
  {
    value: "bg-destructive/20",
    note: "Same destructive items in dark mode",
    used: "6×",
  },
  {
    value: "bg-destructive/90",
    note: "Badge destructive hover (web)",
    used: "1×",
  },
  {
    value: "bg-foreground/20",
    note: "Backdrop: AlertDialog, Dialog, Drawer, Sheet",
    used: "4×",
  },
  {
    value: "bg-muted/40",
    note: "Accordion trigger while expanded",
    used: "1×",
  },
  {
    value: "bg-muted/50",
    note: "AlertDialog and Dialog footer, Card footer, Item muted variant, Accordion trigger hover (web)",
    used: "5×",
  },
  {
    value: "bg-primary/30",
    note: "Calendar range start, middle and end",
    used: "3×",
  },
  {
    value: "bg-primary/90",
    note: "Badge default hover (web)",
    used: "1×",
  },
  {
    value: "bg-secondary/90",
    note: "Badge secondary hover (web)",
    used: "1×",
  },
  {
    value: "text-foreground/60",
    note: "Tabs trigger when inactive",
    used: "1×",
  },
  {
    value: "text-destructive-foreground/80",
    note: "Alert description: destructive variant and error status",
    used: "2×",
  },
  {
    value: "text-success-foreground/80",
    note: "Alert description: success status",
    used: "1×",
  },
  {
    value: "text-warning-foreground/80",
    note: "Alert description: warning status",
    used: "1×",
  },
  {
    value: "text-info-foreground/80",
    note: "Alert description: info status",
    used: "1×",
  },
  {
    value: "text-background/80",
    note: "Alert description: solid variant",
    used: "1×",
  },
  {
    value: "ring-ring/50",
    note: "Badge focus ring (web)",
    used: "1×",
  },
  {
    value: "ring-destructive/20",
    note: "Badge invalid ring (web)",
    used: "1×",
  },
  {
    value: "ring-destructive/40",
    note: "Badge invalid ring in dark mode (web)",
    used: "1×",
  },
];

function Swatch({ color, className }: { color: string; className?: string }) {
  return (
    <View
      className={cn("size-8 rounded border-2 border-border", className)}
      style={{ backgroundColor: color }}
    />
  );
}

function AlphaSwatch({ color }: { color: string }) {
  return (
    <View className="size-8 flex-row overflow-hidden rounded border-2 border-border">
      <View className="flex-1" style={{ backgroundColor: "#FFFFFF" }} />
      <View className="flex-1" style={{ backgroundColor: "#000000" }} />
      <View
        pointerEvents="none"
        className="absolute inset-0"
        style={{ backgroundColor: color }}
      />
    </View>
  );
}

function ColorRow({ label, hex }: { label: string; hex: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Swatch color={hex} />
      <View>
        <Text variant="muted" className="text-xs">
          {label}
        </Text>
        <Text className="font-mono text-xs">{hex}</Text>
      </View>
    </View>
  );
}

function TokenCard({ token }: { token: Token }) {
  return (
    <View className="w-1/2 pb-3 pr-3">
      <Card size="sm">
        <CardContent className="gap-2">
          <Text className="font-head text-xs">{token.name}</Text>
          <ColorRow label="Light" hex={PALETTE.light[token.key]} />
          <ColorRow label="Dark" hex={PALETTE.dark[token.key]} />
          <Text variant="muted" className="text-xs">
            {token.used === 0 ? "Unused" : `Used ${token.used}×`}
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}

function PaletteDemo() {
  return (
    <View className="gap-6">
      {TOKEN_GROUPS.map((group) => (
        <View key={group.title} className="gap-3">
          <Text className="font-head">{group.title}</Text>
          <View className="flex-row flex-wrap">
            {group.tokens.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </View>
        </View>
      ))}
      <View className="gap-3">
        <Text className="font-head">Opacity</Text>
        <Text variant="muted">
          Alpha swatches are drawn over white and black halves.
        </Text>
        {OPACITY_STEPS.map((step) => (
          <View key={step.percent} className="pb-1 pr-1">
            <Card size="sm">
              <CardContent className="gap-3">
                <View className="flex-row items-baseline justify-between">
                  <Text className="font-head">{`${step.percent}%`}</Text>
                  <Text variant="muted" className="font-mono text-xs">
                    {`alpha ${withAlpha("#000000", step.percent).slice(7)}`}
                  </Text>
                </View>
                {step.items.map((item) => (
                  <View
                    key={item.className}
                    className="flex-row items-center gap-3"
                  >
                    <AlphaSwatch
                      color={withAlpha(PALETTE.light[item.token], step.percent)}
                    />
                    <View className="flex-1">
                      <Text className="font-mono text-xs">
                        {item.className}
                      </Text>
                      <Text variant="muted" className="font-mono text-xs">
                        {withAlpha(PALETTE.light[item.token], step.percent)}
                      </Text>
                    </View>
                    <Text variant="muted" className="text-xs">
                      {`${item.used}×`}
                    </Text>
                  </View>
                ))}
              </CardContent>
            </Card>
          </View>
        ))}
        <View className="pb-1 pr-1">
          <Card size="sm">
            <CardContent className="gap-3">
              <Text className="font-head">Whole element</Text>
              {ELEMENT_OPACITY.map((item) => (
                <View
                  key={item.value}
                  className="flex-row items-center justify-between gap-3"
                >
                  <View className="flex-1">
                    <Text className="font-mono text-xs">{item.value}</Text>
                    <Text variant="muted" className="text-xs">
                      {item.note}
                    </Text>
                  </View>
                  <Text variant="muted" className="text-xs">
                    {item.used}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>
        <View className="pb-1 pr-1">
          <Card size="sm">
            <CardContent className="gap-3">
              <Text className="font-head">Where color/opacity is used</Text>
              {COLOR_OPACITY_USAGE.map((item) => (
                <View
                  key={item.value}
                  className="flex-row items-start justify-between gap-3"
                >
                  <View className="flex-1">
                    <Text className="font-mono text-xs">{item.value}</Text>
                    <Text variant="muted" className="text-xs">
                      {item.note}
                    </Text>
                  </View>
                  <Text variant="muted" className="text-xs">
                    {item.used}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>
      </View>
    </View>
  );
}

export { PaletteDemo };

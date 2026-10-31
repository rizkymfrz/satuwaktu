import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = resolve(root, "src/global.css");
const outPath = resolve(root, "src/theme/palette.ts");
const appJsonPath = resolve(root, "app.json");
const mode = process.argv[2] ?? "check";

function parseBlock(css, selector) {
  const start = css.indexOf(selector);
  if (start === -1) {
    throw new Error(`Block ${selector} not found in global.css`);
  }
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const tokens = {};
  for (const match of css
    .slice(open + 1, close)
    .matchAll(/--([a-z-]+):\s*(\d+)\s+(\d+)\s+(\d+)\s*;/g)) {
    tokens[match[1]] = [Number(match[2]), Number(match[3]), Number(match[4])];
  }
  return tokens;
}

function toHex([r, g, b]) {
  return `#${[r, g, b]
    .map((v) => Math.round(v).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function camel(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function over(fg, alpha, bg) {
  return fg.map((v, i) => v * alpha + bg[i] * (1 - alpha));
}

const css = readFileSync(cssPath, "utf8");
const themes = {
  light: parseBlock(css, ":root"),
  dark: parseBlock(css, ".dark:root"),
};

if (mode === "sync") {
  const body = Object.entries(themes)
    .map(
      ([name, tokens]) =>
        `  ${name}: {\n${Object.entries(tokens)
          .map(([key, rgb]) => `    ${camel(key)}: "${toHex(rgb)}",`)
          .join("\n")}\n  },`,
    )
    .join("\n");
  writeFileSync(
    outPath,
    `const PALETTE = {\n${body}\n} as const;\n\ntype PaletteToken = keyof typeof PALETTE.light;\n\nexport { PALETTE };\nexport type { PaletteToken };\n`,
  );
  console.log(`Wrote ${outPath}`);
  process.exit(0);
}

const TEXT = 4.5;
const UI = 3;
const results = [];

function record(theme, label, ratio, min) {
  results.push({ theme, label, ratio, min, pass: ratio >= min });
}

for (const theme of ["light", "dark"]) {
  const t = themes[theme];
  const pair = (fg, bg, min) =>
    record(theme, `${fg} on ${bg}`, contrast(t[fg], t[bg]), min);
  pair("foreground", "background", TEXT);
  pair("foreground", "card", TEXT);
  pair("foreground", "muted", TEXT);
  pair("foreground", "accent", TEXT);
  pair("card-foreground", "card", TEXT);
  pair("popover-foreground", "popover", TEXT);
  pair("primary-foreground", "primary", TEXT);
  pair("primary-foreground", "primary-hover", TEXT);
  pair("secondary-foreground", "secondary", TEXT);
  pair("accent-foreground", "accent", TEXT);
  pair("destructive-foreground", "destructive", TEXT);
  pair("success-foreground", "success", TEXT);
  pair("warning-foreground", "warning", TEXT);
  pair("info-foreground", "info", TEXT);
  pair("muted-foreground", "background", TEXT);
  pair("muted-foreground", "card", TEXT);
  pair("muted-foreground", "muted", TEXT);
  pair("destructive", "background", TEXT);
  pair("destructive", "card", TEXT);
  pair("success", "popover", UI);
  pair("warning", "popover", UI);
  pair("info", "popover", UI);
  pair("border", "background", UI);
  pair("border", "card", UI);
  pair("ring", "background", UI);
  pair("primary", "background", 1.2);
  pair("accent", "background", 1.1);
  const tint = (label, fg, alpha, base, textToken) => {
    const mixed = over(t[fg], alpha, t[base]);
    record(
      theme,
      `${textToken} on ${label}`,
      contrast(t[textToken], mixed),
      TEXT,
    );
  };
  tint("primary/30 over card", "primary", 0.3, "card", "foreground");
  tint("muted/50 over card", "muted", 0.5, "card", "foreground");
  tint("muted/40 over card", "muted", 0.4, "card", "foreground");
  tint(
    "destructive/10 over popover",
    "destructive",
    0.1,
    "popover",
    "destructive",
  );
  tint(
    "destructive/20 over popover",
    "destructive",
    0.2,
    "popover",
    "destructive",
  );
  const alphaText = (fg, alpha, bg) =>
    record(
      theme,
      `${fg}/${alpha * 100} on ${bg}`,
      contrast(over(t[fg], alpha, t[bg]), t[bg]),
      TEXT,
    );
  alphaText("destructive-foreground", 0.8, "destructive");
  alphaText("success-foreground", 0.8, "success");
  alphaText("warning-foreground", 0.8, "warning");
  alphaText("info-foreground", 0.8, "info");
  alphaText("background", 0.8, "foreground");
  alphaText("foreground", 0.6, "card");
}

const appJson = JSON.parse(readFileSync(appJsonPath, "utf8"));
const splash = appJson.expo.plugins.find(
  (p) => Array.isArray(p) && p[0] === "expo-splash-screen",
)?.[1]?.backgroundColor;
const primaryHex = toHex(themes.light.primary);
const syncIssues = [];
if (splash?.toUpperCase() !== primaryHex) {
  syncIssues.push(
    `app.json splash ${splash} differs from primary ${primaryHex}`,
  );
}
const failed = results.filter((r) => !r.pass);
for (const r of results) {
  console.log(
    `${r.pass ? "PASS" : "FAIL"}  ${r.theme.padEnd(5)}  ${r.ratio
      .toFixed(2)
      .padStart(5)} (min ${r.min})  ${r.label}`,
  );
}
for (const issue of syncIssues) {
  console.log(`WARN  ${issue}`);
}
console.log(
  `\n${results.length - failed.length}/${results.length} contrast checks passed, ${syncIssues.length} sync warning(s)`,
);
process.exit(failed.length > 0 ? 1 : 0);

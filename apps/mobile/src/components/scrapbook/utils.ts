type TornEdge = "none" | "top" | "bottom" | "both";

function hashSeed(key: string) {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRng(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tiltFor(key: string, max = 3) {
  const value = seededRng(hashSeed(key))();
  return Math.round((value * 2 - 1) * max * 10) / 10;
}

function paperPath({
  width,
  height,
  torn,
  seed,
  inset,
  amplitude,
  step,
  radius,
}: {
  width: number;
  height: number;
  torn: TornEdge;
  seed: number;
  inset: number;
  amplitude: number;
  step: number;
  radius: number;
}) {
  const rng = seededRng(seed);
  const left = inset;
  const right = width - inset;
  const top = inset;
  const bottom = height - inset;
  const tornTop = torn === "top" || torn === "both";
  const tornBottom = torn === "bottom" || torn === "both";
  const r = Math.min(radius, (right - left) / 2, (bottom - top) / 2);
  const commands: string[] = [];
  const jagged = (
    from: number,
    to: number,
    base: number,
    direction: 1 | -1,
    start: boolean,
  ) => {
    const count = Math.max(2, Math.round(Math.abs(to - from) / step));
    for (let index = 0; index <= count; index += 1) {
      const x = from + ((to - from) * index) / count;
      const depth = rng() * amplitude * direction;
      const point = `${x.toFixed(1)} ${(base + depth).toFixed(1)}`;
      commands.push(start && index === 0 ? `M${point}` : `L${point}`);
    }
  };
  if (tornTop) {
    jagged(left, right, top, 1, true);
  } else {
    commands.push(`M${left + r} ${top}`, `L${right - r} ${top}`);
    commands.push(`A${r} ${r} 0 0 1 ${right} ${top + r}`);
  }
  if (tornBottom) {
    jagged(right, left, bottom, -1, false);
  } else {
    commands.push(`L${right} ${bottom - r}`);
    commands.push(`A${r} ${r} 0 0 1 ${right - r} ${bottom}`);
    commands.push(`L${left + r} ${bottom}`);
    commands.push(`A${r} ${r} 0 0 1 ${left} ${bottom - r}`);
  }
  if (!tornTop) {
    commands.push(`L${left} ${top + r}`);
    commands.push(`A${r} ${r} 0 0 1 ${left + r} ${top}`);
  }
  return `${commands.join(" ")} Z`;
}

function pressShift(pressed: boolean, offset = 4) {
  return pressed
    ? { transform: [{ translateX: offset }, { translateY: offset }] }
    : undefined;
}

export { hashSeed, paperPath, pressShift, seededRng, tiltFor };
export type { TornEdge };

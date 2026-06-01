import { cn } from "@/shared/lib/cn";

interface ScrapbookDecorProps {
  fragmenId: string;
  takenAt: string | Date;
  className?: string;
}

const simpleHash = (str: string): number => {
  let h = 0;
  for (const c of str) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h);
};

const TAPE_COLORS = [
  "oklch(0.85 0.1 75 / 0.65)",
  "oklch(0.82 0.08 15 / 0.65)",
  "oklch(0.78 0.07 140 / 0.65)",
];

const STAMP_COLORS = [
  "oklch(0.52 0.13 55)",
  "oklch(0.55 0.1 10)",
  "oklch(0.45 0.08 140)",
];

const WashiTape = ({ hash }: { hash: number }) => {
  const leftPct = 15 + (hash % 31);
  const rotation = ((hash >> 8) % 13) - 6;
  const color = TAPE_COLORS[(hash >> 12) % 3]!;

  return (
    <div
      className="absolute z-20 h-5 w-20 rounded-sm"
      style={{
        top: "0px",
        left: `${leftPct}%`,
        transform: `rotate(${rotation}deg)`,
        backgroundColor: color,
        boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
      }}
    />
  );
};

const CornerMount = ({ hash }: { hash: number }) => {
  const variant = (hash >> 4) % 2;
  const corners =
    variant === 0
      ? ["tl", "br"] // diagonal pair
      : ["tl", "tr", "bl", "br"];

  const styles: Record<string, React.CSSProperties> = {
    tl: { top: 3, left: 3, borderTop: "2px solid", borderLeft: "2px solid" },
    tr: {
      top: 3,
      right: 3,
      borderTop: "2px solid",
      borderRight: "2px solid",
    },
    bl: {
      bottom: 3,
      left: 3,
      borderBottom: "2px solid",
      borderLeft: "2px solid",
    },
    br: {
      bottom: 3,
      right: 3,
      borderBottom: "2px solid",
      borderRight: "2px solid",
    },
  };

  return (
    <>
      {corners.map((c) => (
        <div
          key={c}
          className={cn("absolute z-20 h-3 w-3 opacity-50")}
          style={{
            ...styles[c],
            borderColor: "oklch(0.18 0.035 55)",
          }}
        />
      ))}
    </>
  );
};

const PaperClip = ({ hash }: { hash: number }) => {
  const side = (hash >> 4) % 2;
  const posStyle: React.CSSProperties =
    side === 0 ? { top: 4, right: 10 } : { top: 4, left: 10 };

  return (
    <svg
      width="14"
      height="30"
      viewBox="0 0 14 30"
      fill="none"
      stroke="oklch(0.35 0.04 55)"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="absolute z-20 opacity-60"
      style={posStyle}
    >
      <path d="M7 28 C2 28 2 2 7 2 C12 2 12 24 7 24 C4 24 4 6 7 6 C9 6 9 20 7 20" />
    </svg>
  );
};

const CircularStamp = ({
  hash,
  takenAt,
}: {
  hash: number;
  takenAt: string | Date;
}) => {
  const year = new Date(takenAt).getFullYear().toString().slice(-2);
  const side = (hash >> 4) % 2;
  const rotation = -12 + ((hash >> 8) % 7);
  const color = STAMP_COLORS[(hash >> 12) % 3]!;

  const posStyle: React.CSSProperties =
    side === 0 ? { bottom: 4, right: 4 } : { bottom: 4, left: 4 };

  return (
    <div
      className="absolute z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 opacity-35"
      style={{
        ...posStyle,
        borderColor: color,
        color,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <span className="text-[9px] font-bold leading-none">&apos;{year}</span>
    </div>
  );
};

export const ScrapbookDecor = ({
  fragmenId,
  takenAt,
  className,
}: ScrapbookDecorProps) => {
  const hash = simpleHash(fragmenId);
  if (hash % 10 < 3) return null;
  const type = hash % 4;

  return (
    <div
      className={cn("absolute -inset-2 z-10 pointer-events-none", className)}
    >
      {type === 0 && <WashiTape hash={hash} />}
      {type === 1 && <CornerMount hash={hash} />}
      {type === 2 && <PaperClip hash={hash} />}
      {type === 3 && <CircularStamp hash={hash} takenAt={takenAt} />}
    </div>
  );
};

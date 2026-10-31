import type { Fragment } from "@/features/archive/types";

type TimelineRowData =
  | {
      type: "header";
      key: string;
      label: string;
      count: number;
      partial: boolean;
    }
  | { type: "item"; key: string; fragment: Fragment };

export type { TimelineRowData };

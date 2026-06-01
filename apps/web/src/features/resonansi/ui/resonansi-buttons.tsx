"use client";

import { useState } from "react";
import type { ResonansiCount, ResonansiType } from "@satuwaktu/types";
import { RESONANSI_LABELS } from "@satuwaktu/constants";
import { api } from "@/shared/lib/api";
import { Button } from "@/shared/ui/button";

interface ResonansiButtonsProps {
  fragmenId: string;
  initial: ResonansiCount;
}

function getOrCreateVisitorToken(): string {
  const key = "satuwaktu_visitor";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const token = crypto.randomUUID();
  localStorage.setItem(key, token);
  return token;
}

const TYPES: ResonansiType[] = ["BEEN_HERE", "BEING_HERE", "MISS_THIS"];

export function ResonansiButtons({
  fragmenId,
  initial,
}: ResonansiButtonsProps) {
  const [counts, setCounts] = useState(initial);

  const toggle = async (type: ResonansiType) => {
    const visitorToken = getOrCreateVisitorToken();
    await api.resonansi.toggle(fragmenId, { type, visitorToken });
    const updated = await api.resonansi.getCounts(fragmenId);
    setCounts(updated);
  };

  return (
    <div className="flex gap-2">
      {TYPES.map((type) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          onClick={() => void toggle(type)}
        >
          {RESONANSI_LABELS[type]} · {counts[type]}
        </Button>
      ))}
    </div>
  );
}

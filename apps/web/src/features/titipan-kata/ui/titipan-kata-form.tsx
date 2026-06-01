"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/shared/lib/api";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

function getOrCreateVisitorToken(): string {
  const key = "satuwaktu_visitor";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const token = crypto.randomUUID();
  localStorage.setItem(key, token);
  return token;
}

interface TitipanKataFormProps {
  fragmenId: string;
  onSubmitted?: () => void;
}

export function TitipanKataForm({
  fragmenId,
  onSubmitted,
}: TitipanKataFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const visitorToken = getOrCreateVisitorToken();
      await api.titipanKata.create(fragmenId, {
        content: content.trim(),
        visitorToken,
      });
      setContent("");
      toast.success("Titipan tersampaikan.");
      onSubmitted?.();
    } catch {
      toast.error("Gagal mengirim titipan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Titipkan sepatah kata…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        rows={3}
      />
      <Button
        size="sm"
        onClick={() => void submit()}
        disabled={loading || !content.trim()}
      >
        Kirim
      </Button>
    </div>
  );
}

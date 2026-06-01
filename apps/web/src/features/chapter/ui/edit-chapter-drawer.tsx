"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Chapter } from "@satuwaktu/types";
import { api } from "@/shared/lib/api";
import { Button } from "@/shared/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

interface EditChapterDrawerProps {
  chapter: Chapter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditChapterDrawer = ({
  chapter,
  open,
  onOpenChange,
}: EditChapterDrawerProps) => {
  const router = useRouter();
  const [title, setTitle] = useState(chapter.title);
  const [description, setDescription] = useState(chapter.description ?? "");
  const [coverUrl, setCoverUrl] = useState(chapter.coverUrl ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await api.chapter.update(chapter.id, {
        title: title || undefined,
        description: description || undefined,
        coverUrl: coverUrl || undefined,
      });
      toast.success("Chapter diperbarui.");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Chapter</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-4 overflow-y-auto px-4 pb-8">
          <div className="space-y-1">
            <Label>Judul</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Deskripsi</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label>Cover URL</Label>
            <Input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <Button
            className="w-full"
            onClick={() => void submit()}
            disabled={loading}
          >
            {loading ? "Menyimpan…" : "Simpan"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

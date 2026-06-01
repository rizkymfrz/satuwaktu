"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
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

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export const AddChapterDrawer = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (!title.trim()) {
      toast.error("Judul wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await api.chapter.create({
        title: title.trim(),
        slug: toSlug(title),
        description: description || undefined,
        coverUrl: coverUrl || undefined,
        order: Date.now(),
      });
      toast.success("Chapter dibuat.");
      setOpen(false);
      setTitle("");
      setDescription("");
      setCoverUrl("");
      router.refresh();
    } catch {
      toast.error("Gagal membuat chapter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger: square dashed card matching ChapterCard layout */}
      <button
        onClick={() => setOpen(true)}
        className="group flex flex-col items-center gap-2"
        aria-label="Buat chapter baru"
      >
        <div className="relative aspect-square w-full flex items-center justify-center rounded-lg border-2 border-dashed border-border/50 transition-colors hover:border-primary/50">
          <div className="flex flex-col items-center gap-1 text-muted-foreground/50 transition-colors group-hover:text-primary/70">
            <Plus className="size-6" />
          </div>
        </div>
        <p className="text-xs font-semibold text-muted-foreground/60 group-hover:text-primary/70 transition-colors">
          Buat Chapter
        </p>
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Buat Chapter</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-4 overflow-y-auto px-4 pb-8">
            <div className="space-y-1">
              <Label>
                Judul <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nama chapter…"
              />
              {title && (
                <p className="text-[10px] text-muted-foreground">
                  slug: {toSlug(title)}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Deskripsi</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Opsional…"
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
              disabled={loading || !title.trim()}
            >
              {loading ? "Membuat…" : "Buat Chapter"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

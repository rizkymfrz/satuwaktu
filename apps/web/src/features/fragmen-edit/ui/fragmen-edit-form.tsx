/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Type, ImageIcon, Video, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { DateTimePicker } from "@/shared/ui/date-time-picker";
import type {
  Chapter,
  FragmenType,
  FragmenWithRelations,
  Media,
  Mood,
} from "@satuwaktu/types";
import { api } from "@/shared/lib/api";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";

const MOODS: { value: Mood; label: string }[] = [
  { value: "HANGAT", label: "Hangat" },
  { value: "SUNYI", label: "Sunyi" },
  { value: "RIUH", label: "Riuh" },
  { value: "SENDU", label: "Sendu" },
  { value: "TERANG", label: "Terang" },
];

interface FragmenEditFormProps {
  fragmen: FragmenWithRelations;
  onSuccess?: () => void;
  hideTitle?: boolean;
}

export const FragmenEditForm = ({
  fragmen,
  onSuccess,
  hideTitle,
}: FragmenEditFormProps) => {
  const router = useRouter();
  const [type, setType] = useState<FragmenType>(fragmen.type);
  const [caption, setCaption] = useState(fragmen.caption ?? "");
  const [takenAt, setTakenAt] = useState(
    new Date(fragmen.takenAt).toISOString(),
  );
  const [mood, setMood] = useState<Mood | "">(fragmen.mood ?? "");
  const [chapterId, setChapterId] = useState(fragmen.chapterId ?? "");
  const [isPrivate, setIsPrivate] = useState(fragmen.isPrivate);
  const [isDraft, setIsDraft] = useState(fragmen.isDraft);
  const [isPinned, setIsPinned] = useState(fragmen.isPinned);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [media, setMedia] = useState<Media[]>(fragmen.media);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void api.chapter.list().then(setChapters);
  }, []);

  const deleteMedia = async (mediaId: string) => {
    try {
      await api.fragmen.deleteMedia(mediaId);
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
      toast.success("Media dihapus.");
    } catch {
      toast.error("Gagal menghapus media.");
    }
  };

  const removeNewFile = (idx: number) =>
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));

  const submit = async () => {
    setLoading(true);
    try {
      await api.fragmen.update(fragmen.id, {
        caption: caption || undefined,
        takenAt,
        mood: mood || undefined,
        chapterId: chapterId || undefined,
        isPrivate,
        isDraft,
        isPinned,
      });

      for (const file of newFiles) {
        const uploaded = await api.fragmen.uploadMedia(fragmen.id, file);
        setMedia((prev) => [...prev, uploaded]);
      }
      setNewFiles([]);
      if (fileRef.current) fileRef.current.value = "";

      toast.success("Fragmen diperbarui.");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/ruang");
      }
    } catch {
      toast.error("Gagal memperbarui.");
    } finally {
      setLoading(false);
    }
  };

  const newPreviews = newFiles.map((f) => ({
    file: f,
    url: URL.createObjectURL(f),
    isVideo: f.type.startsWith("video/"),
  }));

  const hasMedia = media.length > 0 || newFiles.length > 0;

  const fileInput = (
    <div className="space-y-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => setNewFiles(Array.from(e.target.files ?? []))}
      />
      {!hasMedia ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/50 transition-colors hover:border-primary/50"
        >
          <Plus className="size-6 text-muted-foreground/50 transition-colors group-hover:text-primary/70" />
          <span className="text-xs text-muted-foreground/60 transition-colors group-hover:text-primary/70">
            Pilih file
          </span>
        </button>
      ) : (
        <div className="space-y-2">
          {media.map((m) => (
            <div
              key={m.id}
              className="group relative w-full overflow-hidden rounded-lg border border-border"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${m.url}`}
                alt="media"
                className="w-full h-auto"
              />
              <button
                type="button"
                onClick={() => void deleteMedia(m.id)}
                className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-primary"
              >
                <X className="size-4 text-primary-foreground" />
              </button>
            </div>
          ))}
          {newPreviews.map(({ file, url, isVideo }, i) => (
            <div
              key={`new-${i}`}
              className="group relative w-full overflow-hidden rounded-lg border border-border"
            >
              {isVideo ? (
                <video src={url} className="w-full" muted controls />
              ) : (
                <img src={url} alt={file.name} className="w-full h-auto" />
              )}
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      {!hideTitle && <h1 className="text-xl font-semibold">Edit Fragmen</h1>}
      <Tabs value={type} onValueChange={(v) => setType(v as FragmenType)}>
        <TabsList variant="line" className="w-full">
          <TabsTrigger
            value="TEXT"
            icon={<Type className="size-4" />}
            className="flex-1"
          >
            Teks
          </TabsTrigger>
          <TabsTrigger
            value="PHOTO"
            icon={<ImageIcon className="size-4" />}
            className="flex-1"
          >
            Foto
          </TabsTrigger>
          <TabsTrigger
            value="VIDEO"
            icon={<Video className="size-4" />}
            className="flex-1"
          >
            Video
          </TabsTrigger>
        </TabsList>
        <TabsContent value="TEXT" className="mt-4 space-y-4">
          <div className="space-y-1">
            <Label>Caption</Label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Tulis sesuatu…"
            />
          </div>
        </TabsContent>
        <TabsContent value="PHOTO" className="mt-4 space-y-4">
          {fileInput}
          <div className="space-y-1">
            <Label>Caption</Label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
            />
          </div>
        </TabsContent>
        <TabsContent value="VIDEO" className="mt-4 space-y-4">
          {fileInput}
          <div className="space-y-1">
            <Label>Caption</Label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
            />
          </div>
        </TabsContent>
      </Tabs>
      <DateTimePicker value={takenAt} onChange={setTakenAt} />
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Label>Mood</Label>
          <Select value={mood} onValueChange={(v) => setMood(v as Mood)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih mood…" />
            </SelectTrigger>
            <SelectContent>
              {MOODS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1">
          <Label>Chapter</Label>
          <Select value={chapterId} onValueChange={setChapterId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih chapter…" />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label>Privat</Label>
        <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Simpan sebagai Draft</Label>
        <Switch checked={isDraft} onCheckedChange={setIsDraft} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Pin</Label>
        <Switch checked={isPinned} onCheckedChange={setIsPinned} />
      </div>
      <Button
        className="w-full"
        onClick={() => void submit()}
        disabled={loading}
      >
        {loading ? "Menyimpan…" : "Simpan"}
      </Button>
    </div>
  );
};

/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Type, ImageIcon, Video, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { DateTimePicker } from "@/shared/ui/date-time-picker";
import type { Chapter, FragmenType, Mood } from "@satuwaktu/types";
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

interface FragmenCreateFormProps {
  onSuccess?: () => void;
  hideTitle?: boolean;
}

export const FragmenCreateForm = ({
  onSuccess,
  hideTitle,
}: FragmenCreateFormProps) => {
  const router = useRouter();
  const [type, setType] = useState<FragmenType>("TEXT");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [takenAt, setTakenAt] = useState(new Date().toISOString());
  const [mood, setMood] = useState<Mood | "">("");
  const [chapterId, setChapterId] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void api.chapter.list().then(setChapters);
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      const fragmen = await api.fragmen.create({
        type,
        caption: caption || undefined,
        takenAt,
        mood: mood || undefined,
        chapterId: chapterId || undefined,
        isPrivate,
        isDraft,
      });

      for (const file of files) {
        await api.fragmen.uploadMedia(fragmen.id, file);
      }

      toast.success("Fragmen diabadikan.");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/ruang");
      }
    } catch {
      toast.error("Gagal menyimpan fragmen.");
    } finally {
      setLoading(false);
    }
  };

  const previews = files.map((f) => ({
    file: f,
    url: URL.createObjectURL(f),
    isVideo: f.type.startsWith("video/"),
  }));

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const fileInput = (
    <div className="space-y-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
      />
      {files.length === 0 ? (
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
          {previews.map(({ file, url, isVideo }, i) => (
            <div
              key={i}
              className="group relative w-full overflow-hidden rounded-lg border border-border"
            >
              {isVideo ? (
                <video src={url} className="w-full" muted controls />
              ) : (
                <img src={url} alt={file.name} className="w-full h-auto" />
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-primary"
              >
                <X className="size-4 text-primary-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      {!hideTitle && <h1 className="text-xl font-semibold">Abadikan</h1>}
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
        <div className="space-y-1 flex-1">
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
        <div className="space-y-1 flex-1">
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
      <Button
        className="w-full"
        onClick={() => void submit()}
        disabled={loading}
      >
        {loading ? "Menyimpan…" : "Abadikan"}
      </Button>
    </div>
  );
};

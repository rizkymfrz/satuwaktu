"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Chapter } from "@satuwaktu/types";
import { api } from "@/shared/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface SortableChapterProps {
  chapter: Chapter;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

function SortableChapter({
  chapter,
  onDelete,
  onRename,
}: SortableChapterProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chapter.title);

  const save = async () => {
    if (title.trim() === chapter.title) {
      setEditing(false);
      return;
    }
    try {
      await api.chapter.update(chapter.id, { title: title.trim() });
      onRename(chapter.id, title.trim());
      toast.success("Chapter diperbarui.");
    } catch {
      toast.error("Gagal memperbarui.");
    }
    setEditing(false);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardContent className="flex items-center gap-3 py-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-muted-foreground"
          >
            <GripVertical className="size-4" />
          </button>

          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => void save()}
              onKeyDown={(e) => {
                if (e.key === "Enter") void save();
                if (e.key === "Escape") setEditing(false);
              }}
              autoFocus
              className="h-7 text-sm"
            />
          ) : (
            <span
              className="flex-1 cursor-text text-sm"
              onDoubleClick={() => setEditing(true)}
            >
              {chapter.title}
            </span>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive">
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus chapter?</AlertDialogTitle>
                <AlertDialogDescription>
                  Fragmen dalam chapter ini tidak akan ikut terhapus.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => void onDelete(chapter.id)}>
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

interface ChapterManageProps {
  initial: Chapter[];
}

export function ChapterManage({ initial }: ChapterManageProps) {
  const [chapters, setChapters] = useState(initial);
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = chapters.findIndex((c) => c.id === active.id);
    const newIndex = chapters.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(chapters, oldIndex, newIndex);
    setChapters(reordered);

    await Promise.all(
      reordered.map((c, i) => api.chapter.update(c.id, { order: i })),
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await api.chapter.delete(id);
      setChapters((prev) => prev.filter((c) => c.id !== id));
      toast.success("Chapter dihapus.");
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  const handleRename = (id: string, title: string) => {
    setChapters((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newSlug.trim()) return;
    setCreating(true);
    try {
      const created = await api.chapter.create({
        title: newTitle.trim(),
        slug: newSlug.trim(),
        description: newDesc.trim() || undefined,
        order: chapters.length,
      });
      setChapters((prev) => [...prev, created]);
      setNewTitle("");
      setNewSlug("");
      setNewDesc("");
      setOpen(false);
      toast.success("Chapter dibuat.");
    } catch {
      toast.error("Gagal membuat chapter.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Kelola Chapter</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Buat Chapter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chapter Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Nama</Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nama chapter…"
                />
              </div>
              <div className="space-y-1">
                <Label>Slug</Label>
                <Input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="nama-chapter"
                />
              </div>
              <div className="space-y-1">
                <Label>Deskripsi (opsional)</Label>
                <Input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => void handleCreate()} disabled={creating}>
                {creating ? "Membuat…" : "Buat"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => void handleDragEnd(e)}
      >
        <SortableContext
          items={chapters.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {chapters.map((c) => (
              <SortableChapter
                key={c.id}
                chapter={c}
                onDelete={(id) => void handleDelete(id)}
                onRename={handleRename}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

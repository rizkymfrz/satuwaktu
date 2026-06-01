"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Share2 } from "lucide-react";
import { toast } from "sonner";
import type { Chapter } from "@satuwaktu/types";
import { api } from "@/shared/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { EditChapterDrawer } from "./edit-chapter-drawer";

interface ChapterActionsMenuProps {
  chapter: Chapter;
  isOwner: boolean;
}

export const ChapterActionsMenu = ({
  chapter,
  isOwner,
}: ChapterActionsMenuProps) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/chapter/${chapter.slug}`;
    void navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link disalin!"));
  };

  const handleDelete = async () => {
    try {
      await api.chapter.delete(chapter.id);
      toast.success("Chapter dihapus.");
      router.refresh();
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex size-8 items-center justify-center rounded-full bg-background hover:bg-primary"
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal className="size-4 text-foreground hover:text-primary-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          {isOwner && (
            <>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-1 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-1 size-4" />
                Hapus
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="mr-1 size-4" />
            Bagikan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditChapterDrawer
        chapter={chapter}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus chapter ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Chapter akan dihapus. Fragmen di dalamnya tidak akan ikut
              terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDelete()}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

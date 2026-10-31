import { useState } from "react";
import { MAX_CHAPTER_NAME_LENGTH } from "@repo/dto";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useChapterOptions } from "@/features/archive/use-chapter-options";

function NewChapterDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { chapters, createChapter } = useChapterOptions();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      const added = await createChapter(name);
      if (!added) {
        return;
      }
      toast.success(
        chapters.some((item) => item.id === added.id)
          ? `Babak "${added.name}" sudah ada`
          : `Babak "${added.name}" dibuat`,
      );
      setName("");
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Babak baru"
      description="Beri nama bagi babak yang akan kalian rangkai."
      confirmLabel={submitting ? "Membuat..." : "Buat"}
      confirmDisabled={!name.trim() || submitting}
      onConfirm={submit}
    >
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Contoh: Senja di Akhir Tahun"
        accessibilityLabel="Nama babak"
        maxLength={MAX_CHAPTER_NAME_LENGTH}
        returnKeyType="done"
        onSubmitEditing={submit}
      />
    </ConfirmDialog>
  );
}

export { NewChapterDialog };

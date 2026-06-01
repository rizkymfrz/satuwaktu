"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { FragmenCreateForm } from "./fragmen-create-form";

export const AddFragmenDrawer = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="block w-full"
        aria-label="Abadikan fragmen baru"
      >
        <div className="group flex min-h-20 items-center justify-center rounded-lg border-2 border-dashed border-border/50 transition-colors hover:border-primary/50">
          <div className="flex items-center gap-2 text-muted-foreground/50 transition-colors group-hover:text-primary/70">
            <Plus className="size-5" />
            <span className="text-xs font-medium">Abadikan Fragmen</span>
          </div>
        </div>
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Abadikan</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto">
            <FragmenCreateForm
              hideTitle
              onSuccess={() => {
                setOpen(false);
                router.refresh();
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

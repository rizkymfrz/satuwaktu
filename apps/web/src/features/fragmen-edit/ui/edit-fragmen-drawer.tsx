"use client";
import { useRouter } from "next/navigation";
import type { FragmenWithRelations } from "@satuwaktu/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { FragmenEditForm } from "./fragmen-edit-form";

interface EditFragmenDrawerProps {
  fragmen: FragmenWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditFragmenDrawer = ({
  fragmen,
  open,
  onOpenChange,
}: EditFragmenDrawerProps) => {
  const router = useRouter();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Fragmen</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <FragmenEditForm
            fragmen={fragmen}
            hideTitle
            onSuccess={() => {
              onOpenChange(false);
              router.refresh();
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

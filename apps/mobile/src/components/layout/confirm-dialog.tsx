import type { ReactNode } from "react";
import { View } from "react-native";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Text } from "@/components/ui/text";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  destructive?: boolean;
  confirmDisabled?: boolean;
  children?: ReactNode;
};

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  cancelLabel = "Batal",
  destructive = false,
  confirmDisabled = false,
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children ? <View className="px-4">{children}</View> : null}
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>{cancelLabel}</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : undefined}
            disabled={confirmDisabled}
            onPress={onConfirm}
          >
            <Text>{confirmLabel}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmDialog };

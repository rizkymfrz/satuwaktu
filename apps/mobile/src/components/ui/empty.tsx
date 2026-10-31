import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { View, type ViewProps } from "react-native";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const emptyMediaVariants = cva("mb-2 shrink-0 items-center justify-center", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "size-8 rounded-md bg-muted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Empty({
  className,
  shadow = true,
  ...props
}: ViewProps & { shadow?: boolean }) {
  const contentClassName = cn(
    "w-full min-w-0 flex-col items-center justify-center gap-4 rounded-md border-2 border-border bg-card p-6",
    className,
  );
  if (shadow) {
    return (
      <ShadowBox
        size="md"
        className="mb-1 mr-1"
        contentClassName={contentClassName}
        {...props}
      />
    );
  }
  return <View className={contentClassName} {...props} />;
}

function EmptyHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  );
}

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: ViewProps & VariantProps<typeof emptyMediaVariants>) {
  return (
    <View
      className={cn(emptyMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      role="heading"
      className={cn(
        "text-center font-head text-sm font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function EmptyDescription({
  className,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "text-center text-sm leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "w-full min-w-0 max-w-sm flex-col items-center gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};

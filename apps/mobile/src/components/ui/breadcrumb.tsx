import { ChevronRight, MoreHorizontal } from "lucide-react-native";
import type { ComponentProps } from "react";
import { Platform, Pressable, View, type ViewProps } from "react-native";
import { Slot } from "@rn-primitives/slot";
import { Icon } from "@/components/ui/icon";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function Breadcrumb({ className, ...props }: ViewProps) {
  return (
    <View
      role="navigation"
      aria-label="breadcrumb"
      className={className}
      {...props}
    />
  );
}

function BreadcrumbList({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-sm text-muted-foreground">
      <View
        role="list"
        className={cn("flex-row flex-wrap items-center gap-1.5", className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function BreadcrumbItem({ className, ...props }: ViewProps) {
  return (
    <View
      role="listitem"
      className={cn("flex-row items-center gap-1.5", className)}
      {...props}
    />
  );
}

type BreadcrumbLinkProps = ComponentProps<typeof Pressable> & {
  asChild?: boolean;
};

function BreadcrumbLink({ asChild, className, ...props }: BreadcrumbLinkProps) {
  const Component = asChild ? Slot : Pressable;
  return (
    <Component
      role="link"
      className={cn(
        "font-head",
        Platform.select({ web: "transition-colors hover:text-foreground" }),
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      role="link"
      aria-disabled
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: ViewProps) {
  return (
    <View
      role="presentation"
      aria-hidden
      className={cn("items-center justify-center", className)}
      {...props}
    >
      {children ?? (
        <Icon as={ChevronRight} size={14} className="text-muted-foreground" />
      )}
    </View>
  );
}

function BreadcrumbEllipsis({ className, ...props }: ViewProps) {
  return (
    <View
      role="presentation"
      aria-hidden
      className={cn("size-5 items-center justify-center", className)}
      {...props}
    >
      <Icon as={MoreHorizontal} size={16} className="text-muted-foreground" />
      <Text className="sr-only">More</Text>
    </View>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};

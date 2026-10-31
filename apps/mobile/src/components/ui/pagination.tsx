import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react-native";
import { View, type ViewProps } from "react-native";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: ViewProps) {
  return (
    <View
      role="navigation"
      aria-label="pagination"
      className={cn("w-full items-center justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: ViewProps) {
  return (
    <View
      role="list"
      className={cn("flex-row flex-wrap items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: ViewProps) {
  return <View role="listitem" {...props} />;
}

type PaginationLinkProps = Omit<ButtonProps, "variant"> & {
  isActive?: boolean;
};

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      role="link"
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "default" : "ghost"}
      size={size}
      className={cn(size === "icon" && "size-9 p-0", className)}
      {...props}
    />
  );
}

type PaginationDirectionProps = Omit<PaginationLinkProps, "children"> & {
  text?: string;
};

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: PaginationDirectionProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-2", className)}
      {...props}
    >
      <Icon as={ChevronLeft} size={16} className="text-foreground" />
      <Text>{text}</Text>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: PaginationDirectionProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-2", className)}
      {...props}
    >
      <Text>{text}</Text>
      <Icon as={ChevronRight} size={16} className="text-foreground" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: ViewProps) {
  return (
    <View
      aria-hidden
      className={cn("size-9 items-center justify-center", className)}
      {...props}
    >
      <Icon as={MoreHorizontal} size={16} className="text-foreground" />
      <Text className="sr-only">More pages</Text>
    </View>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

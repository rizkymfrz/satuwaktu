import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type Attributes,
  type ComponentProps,
} from "react";
import { View } from "react-native";
import * as AvatarPrimitive from "@rn-primitives/avatar";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type AvatarSize = keyof typeof SIZE_CLASS;

const SIZE_CLASS = {
  sm: "size-6",
  default: "size-8",
  lg: "size-10",
} as const;

const BADGE_SIZE_CLASS = {
  sm: "size-2",
  default: "size-2.5",
  lg: "size-3",
} as const;

const AvatarSizeContext = createContext<AvatarSize>("default");
const AvatarGroupContext = createContext(false);

function Avatar({
  className,
  size = "default",
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: AvatarSize;
}) {
  const isGrouped = useContext(AvatarGroupContext);
  return (
    <AvatarSizeContext.Provider value={size}>
      <AvatarPrimitive.Root
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full border-2 border-border",
          SIZE_CLASS[size],
          isGrouped && "ring-2 ring-background",
          className,
        )}
        {...props}
      />
    </AvatarSizeContext.Provider>
  );
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full rounded-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  const size = useContext(AvatarSizeContext);
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full flex-row items-center justify-center rounded-full bg-muted font-head text-sm text-muted-foreground",
        size === "sm" && "text-xs",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({
  className,
  children,
  ...props
}: ComponentProps<typeof View>) {
  const size = useContext(AvatarSizeContext);
  return (
    <View
      className={cn(
        "absolute bottom-0 right-0 z-10 items-center justify-center rounded-full bg-primary ring-2 ring-background",
        BADGE_SIZE_CLASS[size],
        className,
      )}
      {...props}
    >
      {size === "sm" ? null : children}
    </View>
  );
}

function AvatarGroup({
  className,
  children,
  ...props
}: ComponentProps<typeof View>) {
  const items = Children.toArray(children);
  return (
    <AvatarGroupContext.Provider value={true}>
      <View className={cn("flex-row", className)} {...props}>
        {items.map((child, index) => {
          if (index === 0 || !isValidElement(child)) {
            return child;
          }
          const { className: childClassName, ...childProps } = child.props as {
            className?: string;
          };
          return cloneElement(child, {
            ...childProps,
            className: cn("-ml-2", childClassName),
            key: child.key ?? index,
          } as Attributes);
        })}
      </View>
    </AvatarGroupContext.Provider>
  );
}

function AvatarGroupCount({
  className,
  size = "default",
  ...props
}: ComponentProps<typeof View> & { size?: AvatarSize }) {
  return (
    <TextClassContext.Provider value="text-sm text-muted-foreground">
      <View
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-background",
          SIZE_CLASS[size],
          className,
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};

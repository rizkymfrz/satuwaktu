import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  Platform,
  Pressable,
  View,
  type PressableStateCallbackType,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Slot } from "@rn-primitives/slot";
import { Separator } from "@/components/ui/separator";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type ItemSize = "default" | "sm" | "xs";

const ItemContext = createContext<{ size: ItemSize }>({
  size: "default",
});

const itemVariants = cva(
  cn(
    "w-full flex-row flex-wrap items-center rounded-md border-2",
    Platform.select({
      web: "outline-none transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    }),
  ),
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border bg-card",
        muted: "border-transparent bg-muted/50",
      },
      size: {
        default: "",
        sm: "",
        xs: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const ITEM_SIZE_STYLE: Record<ItemSize, ViewStyle> = {
  default: { gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  sm: { gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  xs: { gap: 8, paddingHorizontal: 8, paddingVertical: 8 },
};

const itemMediaVariants = cva("shrink-0 items-center justify-center gap-2", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "",
      image: "size-10 overflow-hidden rounded-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function ItemGroup({ className, ...props }: ViewProps) {
  return (
    <View
      role="list"
      className={cn("w-full flex-col gap-4", className)}
      {...props}
    />
  );
}

function ItemSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return <Separator className={cn("my-2 h-0.5", className)} {...props} />;
}

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: ComponentProps<typeof Pressable> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const resolvedSize: ItemSize = size ?? "default";
  const classes = cn(itemVariants({ variant, size }), className);
  const sizeStyle = ITEM_SIZE_STYLE[resolvedSize];
  const pressable = !!(props.onPress || props.onLongPress);
  function renderChildren(state: PressableStateCallbackType) {
    return typeof children === "function" ? children(state) : children;
  }
  if (asChild) {
    return (
      <ItemContext.Provider value={{ size: resolvedSize }}>
        <Slot className={classes} style={sizeStyle} {...props}>
          {children as ReactNode}
        </Slot>
      </ItemContext.Provider>
    );
  }
  if (variant === "outline") {
    return (
      <ItemContext.Provider value={{ size: resolvedSize }}>
        <Pressable
          role={pressable ? "button" : undefined}
          disabled={!pressable}
          className="mb-1 mr-1 w-full"
          {...props}
        >
          {(state) => (
            <ShadowBox
              size="md"
              pressed={pressable && state.pressed}
              contentClassName={classes}
              style={sizeStyle}
            >
              {renderChildren(state)}
            </ShadowBox>
          )}
        </Pressable>
      </ItemContext.Provider>
    );
  }
  if (pressable) {
    return (
      <ItemContext.Provider value={{ size: resolvedSize }}>
        <Pressable
          role="button"
          className={cn(
            classes,
            "active:bg-accent",
            Platform.select({ web: "cursor-pointer hover:bg-accent" }),
          )}
          style={sizeStyle}
          {...props}
        >
          {(state) => renderChildren(state)}
        </Pressable>
      </ItemContext.Provider>
    );
  }
  return (
    <ItemContext.Provider value={{ size: resolvedSize }}>
      <View className={classes} style={sizeStyle}>
        {children as ReactNode}
      </View>
    </ItemContext.Provider>
  );
}

function ItemMedia({
  className,
  variant = "default",
  ...props
}: ViewProps & VariantProps<typeof itemMediaVariants>) {
  const { size } = useContext(ItemContext);
  return (
    <View
      className={cn(
        itemMediaVariants({ variant }),
        variant === "image" && size === "sm" && "size-8",
        variant === "image" && size === "xs" && "size-6",
        className,
      )}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: ViewProps) {
  const { size } = useContext(ItemContext);
  return (
    <View
      className={cn(
        "min-w-0 flex-1 flex-col",
        size === "xs" ? "gap-0" : "gap-1",
        className,
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      numberOfLines={1}
      className={cn("text-sm font-medium leading-snug", className)}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: ComponentProps<typeof Text>) {
  const { size } = useContext(ItemContext);
  return (
    <Text
      numberOfLines={2}
      className={cn(
        "text-left text-sm font-normal leading-normal text-muted-foreground",
        size === "xs" && "text-xs",
        className,
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: ViewProps) {
  return (
    <View className={cn("flex-row items-center gap-2", className)} {...props} />
  );
}

function ItemHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "w-full flex-row items-center justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "w-full flex-row items-center justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};

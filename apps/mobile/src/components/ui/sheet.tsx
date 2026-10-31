import { X } from "lucide-react-native";
import { Fragment, type ComponentProps, type ReactNode } from "react";
import {
  Platform,
  View,
  type GestureResponderEvent,
  type ViewProps,
} from "react-native";
import {
  FadeIn,
  FadeOut,
  ReduceMotion,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import * as DialogPrimitive from "@rn-primitives/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SheetSide = "top" | "right" | "bottom" | "left";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : Fragment;

const OVERLAY_SIDE_CLASS: Record<SheetSide, string> = {
  top: "flex-col justify-start",
  right: "flex-row justify-end",
  bottom: "flex-col justify-end",
  left: "flex-row justify-start",
};

const CONTENT_SIDE_CLASS: Record<SheetSide, string> = {
  top: "w-full border-b-2",
  right: "h-full w-3/4 max-w-sm border-l-2",
  bottom: "w-full border-t-2",
  left: "h-full w-3/4 max-w-sm border-r-2",
};

const NATIVE_WRAPPER_STYLE = {
  top: { width: "100%" },
  right: { height: "100%", width: "75%", maxWidth: 384 },
  bottom: { width: "100%" },
  left: { height: "100%", width: "75%", maxWidth: 384 },
} as const;

const WEB_ANIMATION_CLASS: Record<SheetSide, string> = {
  top: "slide-in-from-top-10",
  right: "slide-in-from-right-10",
  bottom: "slide-in-from-bottom-10",
  left: "slide-in-from-left-10",
};

function getSlideAnimations(side: SheetSide) {
  const config = { duration: 250 };
  switch (side) {
    case "top":
      return {
        entering: SlideInUp.duration(config.duration),
        exiting: SlideOutUp.duration(config.duration),
      };
    case "bottom":
      return {
        entering: SlideInDown.duration(config.duration),
        exiting: SlideOutDown.duration(config.duration),
      };
    case "left":
      return {
        entering: SlideInLeft.duration(config.duration),
        exiting: SlideOutLeft.duration(config.duration),
      };
    default:
      return {
        entering: SlideInRight.duration(config.duration),
        exiting: SlideOutRight.duration(config.duration),
      };
  }
}

function SheetOverlay({
  className,
  children,
  side = "right",
  onPress,
  ...props
}: Omit<ComponentProps<typeof DialogPrimitive.Overlay>, "asChild"> & {
  children?: ReactNode;
  side?: SheetSide;
}) {
  const { onOpenChange } = DialogPrimitive.useRootContext();
  const slide = getSlideAnimations(side);
  function onOverlayPress(event: GestureResponderEvent) {
    onPress?.(event);
    if (event.target === event.currentTarget && !event.isDefaultPrevented()) {
      onOpenChange(false);
    }
  }
  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 z-50 bg-foreground/20",
          OVERLAY_SIDE_CLASS[side],
          Platform.select({
            web: "animate-in fade-in-0 fixed cursor-default duration-100 supports-[backdrop-filter]:backdrop-blur-xs [&>*]:cursor-auto",
          }),
          className,
        )}
        {...props}
        onPress={Platform.select({ web: onOverlayPress, native: onPress })}
        asChild={Platform.OS !== "web"}
      >
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable"
        >
          <NativeOnlyAnimatedView
            style={NATIVE_WRAPPER_STYLE[side]}
            entering={slide.entering.reduceMotion(ReduceMotion.System)}
            exiting={slide.exiting.reduceMotion(ReduceMotion.System)}
          >
            <>{children}</>
          </NativeOnlyAnimatedView>
        </NativeOnlyAnimatedView>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function SheetContent({
  className,
  portalHost,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string;
  side?: SheetSide;
  showCloseButton?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const touchesTop = side !== "bottom";
  const closeTop = (touchesTop ? insets.top : 0) + 12;
  return (
    <SheetPortal hostName={portalHost}>
      <SheetOverlay side={side}>
        <DialogPrimitive.Content
          className={cn(
            "z-50 flex-col gap-4 border-border bg-popover",
            Platform.select({
              web: cn(
                CONTENT_SIDE_CLASS[side],
                "outline-none duration-200 animate-in fade-in-0 shadow-md",
                WEB_ANIMATION_CLASS[side],
              ),
              native: cn(
                side === "left" || side === "right"
                  ? "h-full w-full"
                  : "w-full",
                side === "top" && "border-b-2",
                side === "bottom" && "border-t-2",
                side === "left" && "border-r-2",
                side === "right" && "border-l-2",
              ),
            }),
            className,
          )}
          style={Platform.select({
            native: {
              paddingTop: touchesTop ? insets.top : 0,
              paddingBottom: side === "top" ? 0 : insets.bottom,
            },
          })}
          {...props}
        >
          <TextClassContext.Provider value="text-popover-foreground">
            <>{children}</>
          </TextClassContext.Provider>
          {showCloseButton ? (
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-3"
                style={{ top: closeTop }}
                aria-label="Close"
              >
                <Icon as={X} size={16} />
              </Button>
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </SheetOverlay>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: ViewProps) {
  return <View className={cn("flex-col gap-0.5 p-4", className)} {...props} />;
}

function SheetFooter({ className, ...props }: ViewProps) {
  return (
    <View className={cn("mt-auto flex-col gap-2 p-4", className)} {...props} />
  );
}

function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "font-head text-base font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};

export type { SheetSide };

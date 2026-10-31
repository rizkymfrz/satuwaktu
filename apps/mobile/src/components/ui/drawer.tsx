import {
  createContext,
  Fragment,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  PanResponder,
  Platform,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import * as DialogPrimitive from "@rn-primitives/dialog";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type DrawerDirection = "top" | "bottom" | "left" | "right";

const DISMISS_DISTANCE = 80;
const DISMISS_VELOCITY = 0.8;
const DrawerContext = createContext<DrawerDirection>("bottom");

const DRAWER_SIGN: Record<DrawerDirection, 1 | -1> = {
  bottom: 1,
  right: 1,
  top: -1,
  left: -1,
};

const OVERLAY_STYLE: Record<DrawerDirection, ViewStyle> = {
  bottom: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  top: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  left: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
};

const WRAPPER_STYLE: Record<DrawerDirection, ViewStyle> = {
  bottom: { width: "100%", maxHeight: "80%" },
  top: { width: "100%", maxHeight: "80%" },
  left: { height: "100%", width: "75%", maxWidth: 384 },
  right: { height: "100%", width: "75%", maxWidth: 384 },
};

const SURFACE_CLASS: Record<DrawerDirection, string> = {
  bottom: "rounded-t-md border-t-2",
  top: "rounded-b-md border-b-2",
  left: "rounded-r-md border-r-2",
  right: "rounded-l-md border-l-2",
};

const Drawer = function Drawer({
  direction = "bottom",
  ...props
}: ComponentProps<typeof DialogPrimitive.Root> & {
  direction?: DrawerDirection;
}) {
  return (
    <DrawerContext.Provider value={direction}>
      <DialogPrimitive.Root {...props} />
    </DrawerContext.Provider>
  );
};

const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerPortal = DialogPrimitive.Portal;
const DrawerClose = DialogPrimitive.Close;

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : Fragment;

function useDrawerDirection() {
  return useContext(DrawerContext);
}

function DrawerOverlay({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof DialogPrimitive.Overlay>, "asChild"> & {
  children?: ReactNode;
}) {
  const direction = useDrawerDirection();
  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 z-50 bg-foreground/20",
          Platform.select({
            web: "fixed animate-in fade-in-0 duration-100 supports-[backdrop-filter]:backdrop-blur-xs",
          }),
          className,
        )}
        {...props}
        style={[{ display: "flex" }, OVERLAY_STYLE[direction]]}
        asChild={Platform.OS !== "web"}
      >
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable"
        >
          <>{children}</>
        </NativeOnlyAnimatedView>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function getEntering(direction: DrawerDirection) {
  const animation = {
    bottom: SlideInDown,
    top: SlideInUp,
    left: SlideInLeft,
    right: SlideInRight,
  }[direction];
  return animation.duration(250).reduceMotion(ReduceMotion.System);
}

function getExiting(direction: DrawerDirection) {
  const animation = {
    bottom: SlideOutDown,
    top: SlideOutUp,
    left: SlideOutLeft,
    right: SlideOutRight,
  }[direction];
  return animation.duration(200).reduceMotion(ReduceMotion.System);
}

function DrawerContent({
  className,
  portalHost,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string;
}) {
  const direction = useDrawerDirection();
  const { onOpenChange } = DialogPrimitive.useRootContext();
  const insets = useSafeAreaInsets();
  const translate = useSharedValue(0);
  const horizontal = direction === "left" || direction === "right";
  const sign = DRAWER_SIGN[direction];
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          const along = sign * (horizontal ? gesture.dx : gesture.dy);
          const across = Math.abs(horizontal ? gesture.dy : gesture.dx);
          return along > 8 && along > across;
        },
        onPanResponderMove: (_, gesture) => {
          const along = sign * (horizontal ? gesture.dx : gesture.dy);
          translate.set(sign * Math.max(0, along));
        },
        onPanResponderRelease: (_, gesture) => {
          const along = sign * (horizontal ? gesture.dx : gesture.dy);
          const velocity = sign * (horizontal ? gesture.vx : gesture.vy);
          if (along > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
            onOpenChange(false);
            return;
          }
          translate.set(withSpring(0));
        },
        onPanResponderTerminate: () => {
          translate.set(withSpring(0));
        },
      }),
    [horizontal, sign, translate, onOpenChange],
  );
  const translateStyle = useAnimatedStyle(() => ({
    transform: horizontal
      ? [{ translateX: translate.value }]
      : [{ translateY: translate.value }],
  }));
  const fill = horizontal ? { flex: 1 } : undefined;
  return (
    <DrawerPortal hostName={portalHost}>
      <DrawerContext.Provider value={direction}>
        <DrawerOverlay>
          <DialogPrimitive.Content
            className={cn(
              "z-50",
              Platform.select({
                web: "outline-none duration-200 animate-in fade-in-0",
              }),
            )}
            style={WRAPPER_STYLE[direction]}
            {...props}
          >
            <NativeOnlyAnimatedView
              entering={getEntering(direction)}
              exiting={getExiting(direction)}
              style={fill}
            >
              <Animated.View
                {...panResponder.panHandlers}
                style={[fill, translateStyle]}
              >
                <ShadowBox
                  size="md"
                  className={horizontal ? "flex-1" : undefined}
                  contentClassName={cn(
                    "overflow-hidden border-border bg-popover",
                    SURFACE_CLASS[direction],
                    className,
                  )}
                  style={[
                    fill,
                    {
                      paddingTop: direction === "bottom" ? 0 : insets.top,
                      paddingBottom: direction === "top" ? 0 : insets.bottom,
                    },
                  ]}
                >
                  {direction === "bottom" ? (
                    <View className="mx-auto mt-4 h-1 w-24 shrink-0 rounded-full bg-muted" />
                  ) : null}
                  {children}
                </ShadowBox>
              </Animated.View>
            </NativeOnlyAnimatedView>
          </DialogPrimitive.Content>
        </DrawerOverlay>
      </DrawerContext.Provider>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: ViewProps) {
  const direction = useDrawerDirection();
  const centered = direction === "bottom" || direction === "top";
  return (
    <TextClassContext.Provider value={centered ? "text-center" : undefined}>
      <View className={cn("flex flex-col gap-0.5 p-4", className)} {...props} />
    </TextClassContext.Provider>
  );
}

function DrawerFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({
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

function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};

export type { DrawerDirection };

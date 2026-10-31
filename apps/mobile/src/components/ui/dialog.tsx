import { X } from "lucide-react-native";
import { Fragment, type ComponentProps, type ReactNode } from "react";
import {
  Platform,
  View,
  type GestureResponderEvent,
  type ViewProps,
} from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import * as DialogPrimitive from "@rn-primitives/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : Fragment;

function DialogOverlay({
  className,
  children,
  onPress,
  ...props
}: Omit<ComponentProps<typeof DialogPrimitive.Overlay>, "asChild"> & {
  children?: ReactNode;
}) {
  const { onOpenChange } = DialogPrimitive.useRootContext();
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
          "absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-foreground/20 p-2",
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
            style={{ width: "100%", alignItems: "center" }}
            entering={FadeIn.delay(50).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          >
            <>{children}</>
          </NativeOnlyAnimatedView>
        </NativeOnlyAnimatedView>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function DialogContent({
  className,
  portalHost,
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string;
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal hostName={portalHost}>
      <DialogOverlay>
        <DialogPrimitive.Content
          className={cn(
            "z-50 w-full max-w-[calc(100%-2rem)] sm:max-w-sm",
            Platform.select({
              web: "outline-none duration-100 animate-in fade-in-0 zoom-in-95",
            }),
          )}
          {...props}
        >
          <ShadowBox
            size="md"
            contentClassName={cn(
              "w-full flex-col gap-4 overflow-hidden rounded-md border-2 border-border bg-popover p-4 text-popover-foreground",
              className,
            )}
          >
            <>{children}</>
            {showCloseButton ? (
              <DialogPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-2 top-2"
                  aria-label="Close"
                >
                  <Icon as={X} size={16} />
                </Button>
              </DialogPrimitive.Close>
            ) : null}
          </ShadowBox>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-center sm:text-left">
      <View className={cn("flex flex-col gap-2", className)} {...props} />
    </TextClassContext.Provider>
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: ViewProps & {
  showCloseButton?: boolean;
}) {
  return (
    <View
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 border-t-2 border-border bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">
            <Text>Close</Text>
          </Button>
        </DialogPrimitive.Close>
      ) : null}
    </View>
  );
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-head text-base font-medium leading-none", className)}
      {...props}
    />
  );
}

function DialogDescription({
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

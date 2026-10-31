import { Fragment, type ComponentProps, type ReactNode } from "react";
import { Platform, View, type ViewProps } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { KeyboardInsetView } from "@/lib/keyboard-reveal";
import { cn } from "@/lib/utils";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : Fragment;

function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof AlertDialogPrimitive.Overlay>, "asChild"> & {
  children?: ReactNode;
}) {
  return (
    <FullWindowOverlay>
      <AlertDialogPrimitive.Overlay
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-foreground/20 p-2",
          Platform.select({
            web: "fixed animate-in fade-in-0 duration-100 supports-[backdrop-filter]:backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          }),
          className,
        )}
        {...props}
        asChild={Platform.OS !== "web"}
      >
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200)
            .delay(50)
            .reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable"
        >
          <KeyboardInsetView className="w-full flex-1 items-center justify-center">
            {children}
          </KeyboardInsetView>
        </NativeOnlyAnimatedView>
      </AlertDialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function AlertDialogContent({
  className,
  size = "default",
  portalHost,
  children,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content> & {
  portalHost?: string;
  size?: "default" | "sm";
}) {
  return (
    <AlertDialogPortal hostName={portalHost}>
      <AlertDialogOverlay>
        <AlertDialogPrimitive.Content
          className={cn(
            "z-50 w-full max-w-xs",
            size === "default" && "sm:max-w-sm",
            Platform.select({
              web: "outline-none duration-100 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            }),
          )}
          {...props}
        >
          <ShadowBox
            size="md"
            contentClassName={cn(
              "w-full flex-col gap-4 overflow-hidden rounded-md border-2 border-border bg-popover text-popover-foreground",
              className,
            )}
          >
            {children}
          </ShadowBox>
        </AlertDialogPrimitive.Content>
      </AlertDialogOverlay>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-center sm:text-left">
      <View
        className={cn("flex flex-col gap-1.5 p-4 pb-0", className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function AlertDialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "mt-2 flex flex-col-reverse gap-2 border-t-2 border-border bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogMedia({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "mx-4 mt-4 h-10 w-10 items-center justify-center self-center rounded-md bg-muted sm:self-start",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("font-head text-base font-medium", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn(
        "text-muted-foreground text-sm",
        Platform.select({ web: "text-balance md:text-pretty" }),
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<ButtonProps, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Action asChild {...props}>
      <Button variant={variant} size={size} className={className}>
        {children}
      </Button>
    </AlertDialogPrimitive.Action>
  );
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  children,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<ButtonProps, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Cancel asChild {...props}>
      <Button variant={variant} size={size} className={className}>
        {children}
      </Button>
    </AlertDialogPrimitive.Cancel>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};

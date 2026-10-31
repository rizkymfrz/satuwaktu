import { Fragment, type ComponentProps } from "react";
import { Platform, StyleSheet, View, type ViewProps } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import * as PopoverPrimitive from "@rn-primitives/popover";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text, TextClassContext } from "@/components/ui/text";
import { useScreenBottomInset } from "@/lib/screen-insets";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : Fragment;

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  portalHost,
  children,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content> & {
  portalHost?: string;
}) {
  const screenBottomInset = useScreenBottomInset();
  return (
    <PopoverPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <PopoverPrimitive.Overlay
          style={Platform.select({ native: StyleSheet.absoluteFill })}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView
            entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextClassContext.Provider value="text-popover-foreground">
              <PopoverPrimitive.Content
                insets={{ bottom: screenBottomInset }}
                align={align}
                sideOffset={sideOffset}
                className={cn(
                  "outline-hidden z-50",
                  Platform.select({
                    web: cn(
                      "animate-in fade-in-0 zoom-in-95 origin-(--radix-popover-content-transform-origin) cursor-auto",
                      props.side === "bottom" && "slide-in-from-top-2",
                      props.side === "top" && "slide-in-from-bottom-2",
                    ),
                  }),
                )}
                {...props}
              >
                <ShadowBox
                  size="md"
                  contentClassName={cn(
                    "w-72 flex-col gap-2.5 rounded-md border-2 border-border bg-popover p-2.5",
                    className,
                  )}
                >
                  {children}
                </ShadowBox>
              </PopoverPrimitive.Content>
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </PopoverPrimitive.Overlay>
      </FullWindowOverlay>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: ViewProps) {
  return <View className={cn("flex-col gap-0.5", className)} {...props} />;
}

function PopoverTitle({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      role="heading"
      className={cn("font-head text-sm font-medium", className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};

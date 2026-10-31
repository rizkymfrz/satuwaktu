import { Fragment, type ComponentProps } from "react";
import { Platform, StyleSheet } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import * as HoverCardPrimitive from "@rn-primitives/hover-card";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { useScreenBottomInset } from "@/lib/screen-insets";
import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : Fragment;

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  ...props
}: ComponentProps<typeof HoverCardPrimitive.Content>) {
  const screenBottomInset = useScreenBottomInset();
  return (
    <HoverCardPrimitive.Portal>
      <FullWindowOverlay>
        <HoverCardPrimitive.Overlay
          style={Platform.select({ native: StyleSheet.absoluteFill })}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView
            entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextClassContext.Provider value="text-popover-foreground">
              <HoverCardPrimitive.Content
                insets={{ bottom: screenBottomInset }}
                align={align}
                sideOffset={sideOffset}
                className={cn(
                  "outline-hidden z-50",
                  Platform.select({
                    web: cn(
                      "animate-in fade-in-0 zoom-in-95 origin-(--radix-hover-card-content-transform-origin) cursor-default [&>*]:cursor-auto",
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
                    "w-64 rounded-md border-2 border-border bg-popover p-2.5",
                    className,
                  )}
                >
                  <>{children}</>
                </ShadowBox>
              </HoverCardPrimitive.Content>
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </HoverCardPrimitive.Overlay>
      </FullWindowOverlay>
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };

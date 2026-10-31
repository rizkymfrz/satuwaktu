import { Fragment, type ComponentProps } from "react";
import { Platform, StyleSheet } from "react-native";
import {
  FadeInDown,
  FadeInUp,
  FadeOut,
  ReduceMotion,
} from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import * as TooltipPrimitive from "@rn-primitives/tooltip";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { useScreenBottomInset } from "@/lib/screen-insets";
import { cn } from "@/lib/utils";

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : Fragment;

function TooltipContent({
  className,
  sideOffset = 4,
  portalHost,
  side = "top",
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content> & {
  portalHost?: string;
}) {
  const screenBottomInset = useScreenBottomInset();
  return (
    <TooltipPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <TooltipPrimitive.Overlay
          style={Platform.select({ native: StyleSheet.absoluteFill })}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView
            entering={
              side === "top"
                ? FadeInDown.withInitialValues({
                    transform: [{ translateY: 3 }],
                  })
                    .duration(150)
                    .reduceMotion(ReduceMotion.System)
                : FadeInUp.withInitialValues({
                    transform: [{ translateY: -5 }],
                  }).reduceMotion(ReduceMotion.System)
            }
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextClassContext.Provider value="text-xs text-background">
              <TooltipPrimitive.Content
                insets={{ bottom: screenBottomInset }}
                sideOffset={sideOffset}
                className={cn(
                  "z-50",
                  Platform.select({
                    web: cn(
                      "animate-in fade-in-0 zoom-in-95 origin-(--radix-tooltip-content-transform-origin) w-fit max-w-xs text-balance",
                      side === "bottom" && "slide-in-from-top-2",
                      side === "left" && "slide-in-from-right-2",
                      side === "right" && "slide-in-from-left-2",
                      side === "top" && "slide-in-from-bottom-2",
                    ),
                  }),
                )}
                side={side}
                {...props}
              >
                <ShadowBox
                  size="md"
                  className="mb-1 mr-1"
                  contentClassName={cn(
                    "flex-row items-center gap-1.5 rounded-md border-2 border-border bg-foreground px-2 py-1",
                    className,
                  )}
                >
                  <>{children}</>
                </ShadowBox>
              </TooltipPrimitive.Content>
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </TooltipPrimitive.Overlay>
      </FullWindowOverlay>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipTrigger };

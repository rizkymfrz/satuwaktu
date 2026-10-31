import {
  Check,
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react-native";
import { Fragment, type ComponentProps, type ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import * as SelectPrimitive from "@rn-primitives/select";
import { Icon } from "@/components/ui/icon";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { useScreenBottomInset } from "@/lib/screen-insets";
import { cn } from "@/lib/utils";

type Option = SelectPrimitive.Option;

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;

function SelectValue({
  ref,
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Value> & {
  className?: string;
}) {
  const { value } = SelectPrimitive.useRootContext();
  return (
    <SelectPrimitive.Value
      ref={ref}
      className={cn(
        "text-foreground line-clamp-1 flex flex-row items-center gap-2 text-base leading-5",
        !value && "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SelectTrigger({
  ref,
  className,
  children,
  size = "default",
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & {
  children?: ReactNode;
  size?: "default" | "sm";
}) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        Platform.select({
          web: "w-fit cursor-pointer whitespace-nowrap text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
        }),
        props.disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <ShadowBox
        size="md"
        contentClassName={cn(
          "w-full flex-row items-center justify-between gap-1.5 rounded-md border-2 border-border bg-input pl-2.5 pr-2",
          size === "sm" ? "h-9" : "h-10",
        )}
      >
        <>{children}</>
        <Icon
          as={ChevronDown}
          aria-hidden={true}
          className="text-muted-foreground size-4"
        />
      </ShadowBox>
    </SelectPrimitive.Trigger>
  );
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : Fragment;

function SelectContent({
  className,
  children,
  position = "popper",
  portalHost,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content> & {
  className?: string;
  portalHost?: string;
}) {
  const screenBottomInset = useScreenBottomInset();
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <SelectPrimitive.Overlay
          style={Platform.select({ native: StyleSheet.absoluteFill })}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView
            className="z-50"
            entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextClassContext.Provider value="text-popover-foreground">
              <SelectPrimitive.Content
                insets={{ bottom: screenBottomInset }}
                className={cn(
                  "relative z-50 min-w-[8rem]",
                  Platform.select({
                    web: cn(
                      "animate-in fade-in-0 zoom-in-95 origin-(--radix-select-content-transform-origin)",
                      props.side === "bottom" && "slide-in-from-top-2",
                      props.side === "top" && "slide-in-from-bottom-2",
                    ),
                  }),
                  position === "popper" &&
                    Platform.select({
                      web: cn(
                        props.side === "bottom" && "translate-y-1",
                        props.side === "top" && "-translate-y-1",
                      ),
                    }),
                  className,
                )}
                position={position}
                {...props}
              >
                <ShadowBox
                  size="md"
                  contentClassName="overflow-hidden rounded-md border-2 border-border bg-popover"
                >
                  <SelectScrollUpButton />
                  <SelectPrimitive.Viewport
                    className={cn(
                      "p-1",
                      Platform.select({
                        web: "max-h-52 overflow-y-auto overflow-x-hidden",
                      }),
                      position === "popper" &&
                        cn(
                          "w-full",
                          Platform.select({
                            web: "h-[var(--radix-select-trigger-height)] min-w-[var(--radix-select-trigger-width)]",
                          }),
                        ),
                    )}
                  >
                    {children}
                  </SelectPrimitive.Viewport>
                  <SelectScrollDownButton />
                </ShadowBox>
              </SelectPrimitive.Content>
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </SelectPrimitive.Overlay>
      </FullWindowOverlay>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn(
        "text-muted-foreground px-2 py-2 text-xs sm:py-1.5",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "active:bg-accent group relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 sm:py-1.5",
        Platform.select({
          web: "focus:bg-accent focus:text-accent-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 cursor-default outline-none data-[disabled]:pointer-events-none [&_svg]:pointer-events-none",
        }),
        props.disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <View className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon as={Check} className="text-muted-foreground size-4 shrink-0" />
        </SelectPrimitive.ItemIndicator>
      </View>
      <SelectPrimitive.ItemText className="text-foreground group-active:text-accent-foreground select-none text-sm" />
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        "bg-border -mx-1 my-1 h-0.5",
        Platform.select({ web: "pointer-events-none" }),
        className,
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  if (Platform.OS !== "web") {
    return null;
  }
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <Icon as={ChevronUpIcon} className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  if (Platform.OS !== "web") {
    return null;
  }
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <Icon as={ChevronDownIcon} className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option,
};

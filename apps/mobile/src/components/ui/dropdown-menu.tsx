import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react-native";
import { Fragment, type ComponentProps, type ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import * as DropdownMenuPrimitive from "@rn-primitives/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { useScreenBottomInset } from "@/lib/screen-insets";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  iconClassName,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  children?: ReactNode;
  iconClassName?: string;
  inset?: boolean;
}) {
  const { open } = DropdownMenuPrimitive.useSubContext();
  const icon =
    Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm select-none group-active:text-accent-foreground",
        open && "text-accent-foreground",
      )}
    >
      <DropdownMenuPrimitive.SubTrigger
        className={cn(
          "active:bg-accent group flex flex-row items-center rounded-sm px-2 py-2 sm:py-1.5",
          Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none [&_svg]:pointer-events-none",
          }),
          className,
          open && "bg-accent",
          inset && "pl-8",
        )}
        {...props}
      >
        <>{children}</>
        <Icon
          as={icon}
          className={cn(
            "text-foreground ml-auto size-4 shrink-0",
            iconClassName,
          )}
        />
      </DropdownMenuPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
}

function DropdownMenuSubContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <NativeOnlyAnimatedView
      entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
    >
      <DropdownMenuPrimitive.SubContent
        className={cn(
          Platform.select({
            web: "animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fade-in-0 data-[state=closed]:zoom-out-95 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin) z-50 min-w-32",
          }),
        )}
        {...props}
      >
        <ShadowBox
          size="md"
          className="mb-1 mr-1"
          contentClassName={cn(
            "overflow-hidden rounded-md border-2 border-border bg-popover p-1",
            className,
          )}
        >
          <>{children}</>
        </ShadowBox>
      </DropdownMenuPrimitive.SubContent>
    </NativeOnlyAnimatedView>
  );
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : Fragment;

function DropdownMenuContent({
  className,
  overlayClassName,
  overlayStyle,
  portalHost,
  align = "start",
  sideOffset = 4,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  overlayStyle?: StyleProp<ViewStyle>;
  overlayClassName?: string;
  portalHost?: string;
}) {
  const screenBottomInset = useScreenBottomInset();
  const Overlay = portalHost ? Fragment : FullWindowOverlay;
  return (
    <DropdownMenuPrimitive.Portal hostName={portalHost}>
      <Overlay>
        <DropdownMenuPrimitive.Overlay
          style={Platform.select({
            web: overlayStyle ?? undefined,
            native: overlayStyle
              ? StyleSheet.flatten([
                  StyleSheet.absoluteFill,
                  overlayStyle as typeof StyleSheet.absoluteFill,
                ])
              : StyleSheet.absoluteFill,
          })}
          className={overlayClassName}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView
            entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextClassContext.Provider value="text-popover-foreground">
              <DropdownMenuPrimitive.Content
                align={align}
                sideOffset={sideOffset}
                insets={{ bottom: screenBottomInset }}
                className={cn(
                  "min-w-36",
                  Platform.select({
                    web: cn(
                      "animate-in fade-in-0 zoom-in-95 max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) z-50 cursor-default",
                      props.side === "bottom" && "slide-in-from-top-2",
                      props.side === "top" && "slide-in-from-bottom-2",
                    ),
                  }),
                )}
                {...props}
              >
                <ShadowBox
                  size="md"
                  className="mb-1 mr-1"
                  contentClassName={cn(
                    "overflow-hidden rounded-md border-2 border-border bg-popover p-1",
                    className,
                  )}
                >
                  <>{children}</>
                </ShadowBox>
              </DropdownMenuPrimitive.Content>
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </DropdownMenuPrimitive.Overlay>
      </Overlay>
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  className?: string;
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-popover-foreground group-active:text-popover-foreground",
        variant === "destructive" &&
          "text-destructive group-active:text-destructive",
      )}
    >
      <DropdownMenuPrimitive.Item
        className={cn(
          "active:bg-accent group relative flex flex-row items-center gap-2 rounded-sm px-2 py-2 sm:py-1.5",
          Platform.select({
            web: cn(
              "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
              variant === "destructive" &&
                "focus:bg-destructive/10 dark:focus:bg-destructive/20",
            ),
          }),
          variant === "destructive" &&
            "active:bg-destructive/10 dark:active:bg-destructive/20",
          props.disabled && "opacity-50",
          inset && "pl-8",
          className,
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  children?: ReactNode;
}) {
  return (
    <TextClassContext.Provider value="text-sm text-popover-foreground select-none group-active:text-accent-foreground">
      <DropdownMenuPrimitive.CheckboxItem
        className={cn(
          "active:bg-accent group relative flex flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 sm:py-1.5",
          Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
          }),
          props.disabled && "opacity-50",
          className,
        )}
        {...props}
      >
        <View className="absolute right-2 flex size-4 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator>
            <Icon
              as={Check}
              className={cn(
                "text-foreground size-4",
                Platform.select({ web: "pointer-events-none" }),
              )}
            />
          </DropdownMenuPrimitive.ItemIndicator>
        </View>
        <>{children}</>
      </DropdownMenuPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  children?: ReactNode;
}) {
  return (
    <TextClassContext.Provider value="text-sm text-popover-foreground select-none group-active:text-accent-foreground">
      <DropdownMenuPrimitive.RadioItem
        className={cn(
          "active:bg-accent group relative flex flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 sm:py-1.5",
          Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
          }),
          props.disabled && "opacity-50",
          className,
        )}
        {...props}
      >
        <View className="absolute right-2 flex size-4 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator>
            <Icon
              as={Check}
              className={cn(
                "text-foreground size-4",
                Platform.select({ web: "pointer-events-none" }),
              )}
            />
          </DropdownMenuPrimitive.ItemIndicator>
        </View>
        <>{children}</>
      </DropdownMenuPrimitive.RadioItem>
    </TextClassContext.Provider>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  className?: string;
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("bg-border -mx-1 my-1 h-0.5", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};

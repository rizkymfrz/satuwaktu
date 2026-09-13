import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@rn-primitives/accordion";
import { ChevronDown } from "lucide-react-native";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

function Accordion({
  children,
  className,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Root>, "asChild">) {
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        className={cn("w-full flex-col gap-4", className)}
        {...(props as AccordionPrimitive.RootProps)}
        asChild={Platform.OS !== "web"}
      >
        <Animated.View layout={LinearTransition.duration(200)}>
          {children}
        </Animated.View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  );
}

function AccordionItem({
  children,
  className,
  value,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      value={value}
      asChild={Platform.OS !== "web"}
      {...props}
    >
      <Animated.View
        layout={Platform.select({ native: LinearTransition.duration(200) })}
      >
        <AccordionItemBox className={className}>{children}</AccordionItemBox>
      </Animated.View>
    </AccordionPrimitive.Item>
  );
}

function AccordionItemBox({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isExpanded } = AccordionPrimitive.useItemContext();

  return (
    <ShadowBox
      size={isExpanded ? "sm" : "md"}
      contentClassName={cn(
        "rounded-none border-2 border-border bg-background overflow-hidden",
        className,
      )}
    >
      {children}
    </ShadowBox>
  );
}

const Trigger = Platform.OS === "web" ? View : Pressable;

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  children?: React.ReactNode;
}) {
  const { isExpanded } = AccordionPrimitive.useItemContext();

  const progress = useDerivedValue(
    () =>
      isExpanded
        ? withTiming(1, { duration: 250 })
        : withTiming(0, { duration: 200 }),
    [isExpanded],
  );
  const chevronStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${progress.value * 180}deg` }],
    }),
    [progress],
  );

  return (
    <TextClassContext.Provider value="text-left text-base font-head">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger {...props} asChild>
          <Trigger
            className={cn(
              "flex-row items-center justify-between gap-4 px-4 py-3",
              isExpanded && "bg-muted/40",
              Platform.select({
                web: "focus-visible:outline-primary flex flex-1 cursor-pointer outline-none transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2",
              }),
              className,
            )}
          >
            <>{children}</>
            <Animated.View style={chevronStyle}>
              <Icon
                as={ChevronDown}
                size={16}
                className="text-muted-foreground shrink-0"
              />
            </Animated.View>
          </Trigger>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  return (
    <TextClassContext.Provider value="text-sm text-muted-foreground font-sans">
      <AccordionPrimitive.Content
        className={cn(
          "overflow-hidden bg-card",
          Platform.select({
            web: isExpanded ? "animate-accordion-down" : "animate-accordion-up",
          }),
        )}
        {...props}
      >
        <Animated.View
          exiting={Platform.select({
            native: FadeOutUp.duration(200).reduceMotion(ReduceMotion.System),
          })}
          className={cn("px-4 pt-2 pb-4", className)}
        >
          {children}
        </Animated.View>
      </AccordionPrimitive.Content>
    </TextClassContext.Provider>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

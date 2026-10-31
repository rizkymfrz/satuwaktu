import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
} from "react";
import { Platform } from "react-native";
import Animated, {
  FadeInUp,
  LayoutAnimationConfig,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";
import * as CollapsiblePrimitive from "@rn-primitives/collapsible";
import { cn } from "@/lib/utils";

const CollapsibleOpenContext = createContext(false);

function Collapsible({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: Omit<ComponentProps<typeof CollapsiblePrimitive.Root>, "asChild">) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;
  function handleOpenChange(next: boolean) {
    setInternalOpen(next);
    onOpenChange?.(next);
  }
  return (
    <CollapsibleOpenContext.Provider value={isOpen}>
      <LayoutAnimationConfig skipEntering>
        <CollapsiblePrimitive.Root
          open={isOpen}
          onOpenChange={handleOpenChange}
          {...(props as CollapsiblePrimitive.RootProps)}
          asChild={Platform.OS !== "web"}
        >
          <Animated.View layout={LinearTransition.duration(200)}>
            {children}
          </Animated.View>
        </CollapsiblePrimitive.Root>
      </LayoutAnimationConfig>
    </CollapsibleOpenContext.Provider>
  );
}

const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

function CollapsibleContent({
  className,
  children,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Content>) {
  const isOpen = useContext(CollapsibleOpenContext);
  return (
    <CollapsiblePrimitive.Content
      className={cn(
        "overflow-hidden",
        Platform.select({
          web: isOpen ? "animate-accordion-down" : "animate-accordion-up",
        }),
      )}
      {...props}
    >
      <Animated.View
        entering={Platform.select({
          native: FadeInUp.duration(200).reduceMotion(ReduceMotion.System),
        })}
        className={cn(className)}
      >
        {children}
      </Animated.View>
    </CollapsiblePrimitive.Content>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };

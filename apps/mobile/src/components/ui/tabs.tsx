import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext, type ComponentProps } from "react";
import { Platform, View } from "react-native";
import * as TabsPrimitive from "@rn-primitives/tabs";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type TabsOrientation = "horizontal" | "vertical";
type TabsListVariant = "default" | "line";

const TabsOrientationContext = createContext<TabsOrientation>("horizontal");
const TabsListVariantContext = createContext<TabsListVariant>("default");

const TRIGGER_CLASS =
  "flex-row items-center justify-center gap-1.5 rounded-md border-2 px-4 py-1";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: ComponentProps<typeof TabsPrimitive.Root> & {
  orientation?: TabsOrientation;
}) {
  return (
    <TabsOrientationContext.Provider value={orientation}>
      <TabsPrimitive.Root
        orientation={orientation}
        className={cn(
          "flex gap-2",
          orientation === "vertical" ? "flex-row" : "flex-col",
          className,
        )}
        {...props}
      />
    </TabsOrientationContext.Provider>
  );
}

const tabsListVariants = cva("flex items-center justify-center", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "h-fit flex-col",
    },
    variant: {
      default: "gap-2 p-1 pb-2 pr-2",
      line: "gap-1 self-start bg-transparent p-1",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "default",
  },
});

function TabsList({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof TabsPrimitive.List> &
  Pick<VariantProps<typeof tabsListVariants>, "variant">) {
  const orientation = useContext(TabsOrientationContext);
  const list = (
    <TabsPrimitive.List
      className={cn(
        tabsListVariants({ orientation, variant }),
        Platform.select({ web: "inline-flex w-fit" }),
        className,
      )}
      {...props}
    />
  );
  return (
    <TabsListVariantContext.Provider value={variant ?? "default"}>
      {variant === "line" ? (
        list
      ) : (
        <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
          <ShadowBox
            size="md"
            className="mb-1 mr-1"
            contentClassName="rounded-md border-2 border-border bg-card"
          >
            {list}
          </ShadowBox>
        </View>
      )}
    </TabsListVariantContext.Provider>
  );
}

function TabsTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value } = TabsPrimitive.useRootContext();
  const orientation = useContext(TabsOrientationContext);
  const variant = useContext(TabsListVariantContext);
  const active = props.value === value;
  const line = variant === "line";
  const vertical = orientation === "vertical";
  return (
    <TextClassContext.Provider
      value={cn(
        "font-head text-sm font-medium text-foreground/60",
        active && (line ? "text-foreground" : "text-primary-foreground"),
      )}
    >
      <TabsPrimitive.Trigger
        className={cn(
          "relative",
          vertical ? "w-full" : "self-stretch",
          Platform.select({
            web: "cursor-pointer whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
          }),
          props.disabled && "opacity-50",
          className,
        )}
        {...props}
      >
        {active && !line ? (
          <ShadowBox
            size="md"
            contentClassName={cn(
              TRIGGER_CLASS,
              "border-border bg-primary",
              vertical && "justify-start",
            )}
          >
            <>{children}</>
          </ShadowBox>
        ) : (
          <View
            className={cn(
              TRIGGER_CLASS,
              "border-transparent",
              vertical && "justify-start",
            )}
          >
            <>{children}</>
          </View>
        )}
        {line && active ? (
          <View
            pointerEvents="none"
            className={cn(
              "absolute bg-foreground",
              orientation === "vertical"
                ? "inset-y-0 -right-1 w-1"
                : "inset-x-0 -bottom-1 h-1",
            )}
          />
        ) : null}
      </TabsPrimitive.Trigger>
    </TextClassContext.Provider>
  );
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  const orientation = useContext(TabsOrientationContext);
  return (
    <TabsPrimitive.Content
      className={cn(
        orientation === "vertical" && "flex-1",
        Platform.select({ web: "outline-none" }),
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger };

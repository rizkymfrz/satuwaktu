import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useLayoutEffect,
  useState,
  type ComponentProps,
  type RefAttributes,
} from "react";
import { View, type ViewProps } from "react-native";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type CardSize = "default" | "sm";

const SPACING = { default: 16, sm: 12 } as const;

const SPACING_CLASS: Record<CardSize, { px: string; padding: string }> = {
  default: { px: "px-4", padding: "p-4" },
  sm: { px: "px-3", padding: "p-3" },
};

const CardSizeContext = createContext<CardSize>("default");
const CardFooterContext = createContext<(hasFooter: boolean) => void>(() => {});

function Card({
  className,
  size = "default",
  children,
  style,
  ...props
}: ViewProps & { size?: CardSize }) {
  const [hasFooter, setHasFooter] = useState(false);
  return (
    <CardSizeContext.Provider value={size}>
      <CardFooterContext.Provider value={setHasFooter}>
        <TextClassContext.Provider value="text-sm text-card-foreground">
          <ShadowBox
            size="md"
            contentClassName={cn(
              "flex flex-col overflow-hidden rounded-md border-2 border-border bg-card",
              className,
            )}
            style={[
              {
                gap: SPACING[size],
                paddingTop: SPACING[size],
                paddingBottom: hasFooter ? 0 : SPACING[size],
              },
              style,
            ]}
            {...props}
          >
            {children}
          </ShadowBox>
        </TextClassContext.Provider>
      </CardFooterContext.Provider>
    </CardSizeContext.Provider>
  );
}

function CardHeader({
  className,
  children,
  ...props
}: ComponentProps<typeof View> & RefAttributes<View>) {
  const size = useContext(CardSizeContext);
  const items = Children.toArray(children);
  const action = items.find(
    (child) => isValidElement(child) && child.type === CardAction,
  );
  const content = items.filter((child) => child !== action);
  return (
    <View
      className={cn(
        "flex-row items-start gap-1",
        SPACING_CLASS[size].px,
        className,
      )}
      {...props}
    >
      <View className="flex-1 flex-col gap-1">{content}</View>
      {action}
    </View>
  );
}

function CardTitle({
  className,
  ref,
  ...props
}: ComponentProps<typeof Text> & RefAttributes<typeof Text>) {
  const size = useContext(CardSizeContext);
  return (
    <Text
      ref={ref}
      role="heading"
      aria-level={3}
      className={cn(
        "font-head text-base font-medium leading-snug",
        size === "sm" && "text-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: ComponentProps<typeof Text> & RefAttributes<typeof Text>) {
  return (
    <Text
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({
  className,
  ...props
}: ComponentProps<typeof View> & RefAttributes<View>) {
  return <View className={cn("self-start", className)} {...props} />;
}

function CardContent({
  className,
  ...props
}: ComponentProps<typeof View> & RefAttributes<View>) {
  const size = useContext(CardSizeContext);
  return <View className={cn(SPACING_CLASS[size].px, className)} {...props} />;
}

function CardFooter({
  className,
  ...props
}: ComponentProps<typeof View> & RefAttributes<View>) {
  const size = useContext(CardSizeContext);
  const setHasFooter = useContext(CardFooterContext);
  useLayoutEffect(() => {
    setHasFooter(true);
    return () => setHasFooter(false);
  }, [setHasFooter]);
  return (
    <View
      className={cn(
        "flex flex-row items-center border-t-2 border-border bg-muted/50",
        SPACING_CLASS[size].padding,
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};

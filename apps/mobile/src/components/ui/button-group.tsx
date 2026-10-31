import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type Attributes,
  type ComponentProps,
} from "react";
import { View } from "react-native";
import { Slot } from "@rn-primitives/slot";
import { Separator } from "@/components/ui/separator";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type ButtonGroupOrientation = "horizontal" | "vertical";

const ButtonGroupContext = createContext(false);

const SEAM_CLASS: Record<ButtonGroupOrientation, string> = {
  horizontal: "border-l-2 border-border",
  vertical: "border-t-2 border-border",
};

function ButtonGroup({
  className,
  orientation = "horizontal",
  children,
  ...props
}: ComponentProps<typeof View> & {
  orientation?: ButtonGroupOrientation;
}) {
  const items = Children.toArray(children);
  const hasNestedGroup = items.some(
    (child) => isValidElement(child) && child.type === ButtonGroup,
  );
  if (hasNestedGroup) {
    return (
      <View
        role="group"
        className={cn(
          orientation === "horizontal" ? "flex-row" : "flex-col",
          "flex-wrap gap-2",
          className,
        )}
        {...props}
      >
        {children}
      </View>
    );
  }
  return (
    <ButtonGroupContext.Provider value={true}>
      <View style={{ flexDirection: "row" }}>
        <ShadowBox
          size="md"
          contentClassName={cn(
            "overflow-hidden rounded-md border-2 border-border bg-background",
            orientation === "horizontal"
              ? "flex-row items-stretch"
              : "flex-col items-stretch",
            className,
          )}
          role="group"
          {...props}
        >
          {items.map((child, index) => {
            if (
              index === 0 ||
              !isValidElement(child) ||
              child.type === ButtonGroupSeparator
            ) {
              return child;
            }
            const { className: childClassName } = child.props as {
              className?: string;
            };
            return cloneElement(child, {
              className: cn(SEAM_CLASS[orientation], childClassName),
              key: child.key ?? index,
            } as Attributes);
          })}
        </ShadowBox>
      </View>
    </ButtonGroupContext.Provider>
  );
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: ComponentProps<typeof View> & {
  asChild?: boolean;
}) {
  const Component = asChild ? Slot : View;
  return (
    <TextClassContext.Provider value="font-head text-sm font-medium text-foreground">
      <Component
        className={cn(
          "flex-row items-center gap-2 bg-muted px-3 py-1.5",
          className,
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      orientation={orientation}
      className={cn(
        "self-stretch bg-border",
        orientation === "horizontal" ? "h-0.5 w-auto" : "h-auto w-0.5",
        className,
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupContext,
  ButtonGroupSeparator,
  ButtonGroupText,
};

export type { ButtonGroupOrientation };

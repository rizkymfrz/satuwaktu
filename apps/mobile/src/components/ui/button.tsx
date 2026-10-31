import { cva, type VariantProps } from "class-variance-authority";
import { useContext, type ComponentProps, type RefAttributes } from "react";
import {
  Platform,
  Pressable,
  View,
  type PressableStateCallbackType,
} from "react-native";
import { ButtonGroupContext } from "@/components/ui/button-group";
import { ShadowBox, type ShadowSize } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof Pressable> &
  RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    shadowSize?: ShadowSize;
    circle?: boolean;
  };

const SHADOW_VARIANTS = new Set([
  "default",
  "secondary",
  "destructive",
  "outline",
]);

const buttonVariants = cva(
  cn(
    "flex-row items-center justify-center gap-2 rounded-md font-head font-medium",
    Platform.select({
      web: "cursor-pointer select-none whitespace-nowrap outline-none transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      variant: {
        default: "border-2 border-border bg-primary text-primary-foreground",
        secondary:
          "border-2 border-border bg-secondary text-secondary-foreground",
        destructive:
          "border-2 border-border bg-destructive text-destructive-foreground",
        outline: "border-2 border-border bg-transparent text-foreground",
        ghost: cn(
          "bg-transparent text-foreground",
          Platform.select({ web: "hover:bg-accent" }),
        ),
        link: cn(
          "bg-transparent text-foreground",
          Platform.select({ web: "hover:underline" }),
        ),
      },
      size: {
        default: "px-4 py-1.5",
        xs: "px-2 py-0.5",
        sm: "px-3 py-1",
        lg: cn("px-6 py-2", Platform.select({ web: "lg:px-8 lg:py-3" })),
        icon: "p-2",
        "icon-xs": "p-1",
        "icon-sm": "p-1.5",
        "icon-lg": "p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  cn(
    "font-head font-medium",
    Platform.select({ web: "pointer-events-none transition-colors" }),
  ),
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        secondary: "text-secondary-foreground",
        destructive: "text-destructive-foreground",
        outline: "text-foreground",
        ghost: "text-foreground",
        link: cn(
          "text-foreground",
          Platform.select({ web: "group-hover/button:underline" }),
        ),
      },
      size: {
        default: "text-base",
        xs: "text-xs",
        sm: "text-sm",
        lg: cn("text-base", Platform.select({ web: "lg:text-lg" })),
        icon: "text-base",
        "icon-xs": "text-xs",
        "icon-sm": "text-sm",
        "icon-lg": "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  shadowSize = "md",
  circle = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const grouped = useContext(ButtonGroupContext);
  const hasShadow = !grouped && SHADOW_VARIANTS.has(variant ?? "default");
  const boxClassName = cn(
    buttonVariants({ variant, size }),
    grouped && "rounded-none border-0",
    className,
  );
  function renderChildren(state: PressableStateCallbackType) {
    return typeof children === "function" ? children(state) : children;
  }
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        role="button"
        disabled={disabled}
        className={cn(
          "group/button",
          disabled && "opacity-60",
          !hasShadow && boxClassName,
          grouped && "relative",
        )}
        {...props}
      >
        {(state) =>
          hasShadow ? (
            <ShadowBox
              size={shadowSize}
              circle={circle}
              pressed={state.pressed}
              contentClassName={cn(
                boxClassName,
                Platform.select({
                  web: "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg",
                }),
              )}
            >
              {renderChildren(state)}
            </ShadowBox>
          ) : (
            <>
              {renderChildren(state)}
              {grouped ? (
                <View
                  pointerEvents="none"
                  className={cn(
                    "absolute inset-0",
                    variant === "secondary"
                      ? "bg-secondary-foreground"
                      : "bg-foreground",
                  )}
                  style={{
                    opacity: state.pressed
                      ? variant === "secondary"
                        ? 0.4
                        : 0.25
                      : 0,
                  }}
                />
              ) : null}
            </>
          )
        }
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };

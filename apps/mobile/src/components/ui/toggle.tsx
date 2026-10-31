import { cva, type VariantProps } from "class-variance-authority";
import { useContext, type ComponentProps } from "react";
import { Platform, type PressableStateCallbackType } from "react-native";
import * as TogglePrimitive from "@rn-primitives/toggle";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
  cn(
    "flex-row items-center justify-center gap-1 rounded-md border-2 border-border",
    Platform.select({
      web: "inline-flex cursor-pointer whitespace-nowrap outline-none transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      variant: {
        default: "",
        outline: "",
      },
      size: {
        default: "min-h-10 min-w-10 px-2.5",
        sm: "min-h-9 min-w-9 px-2",
        lg: "min-h-11 min-w-11 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  circle = false,
  children,
  ...props
}: ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & { circle?: boolean }) {
  return (
    <TextClassContext.Provider
      value={cn(
        "font-head text-sm font-medium",
        props.pressed ? "text-primary-foreground" : "text-foreground",
      )}
    >
      <TogglePrimitive.Root
        className={cn("group", props.disabled && "opacity-50")}
        {...props}
      >
        {(state: PressableStateCallbackType) => (
          <ShadowBox
            size="md"
            circle={circle}
            pressed={state.pressed}
            contentClassName={cn(
              toggleVariants({ variant, size }),
              props.pressed ? "bg-primary" : "bg-background",
              circle && "rounded-full",
              className,
            )}
          >
            <>{typeof children === "function" ? children(state) : children}</>
          </ShadowBox>
        )}
      </TogglePrimitive.Root>
    </TextClassContext.Provider>
  );
}

function ToggleIcon({ className, ...props }: ComponentProps<typeof Icon>) {
  const textClass = useContext(TextClassContext);
  return (
    <Icon className={cn("size-4 shrink-0", textClass, className)} {...props} />
  );
}

export { Toggle, ToggleIcon, toggleVariants };

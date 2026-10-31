import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import {
  createContext,
  useContext,
  type ComponentProps,
  type RefAttributes,
} from "react";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type AlertVariantProps = VariantProps<typeof alertVariants>;

type AlertProps = ComponentProps<typeof View> &
  RefAttributes<View> &
  AlertVariantProps & {
    icon?: LucideIcon;
    iconClassName?: string;
  };

const alertVariants = cva("", {
  variants: {
    variant: {
      default: "border-border bg-background text-foreground",
      destructive: "border-border bg-destructive text-destructive-foreground",
      solid: "border-border bg-foreground text-background",
    },
    status: {
      error: "border-border bg-destructive text-destructive-foreground",
      success: "border-border bg-success text-success-foreground",
      warning: "border-border bg-warning text-warning-foreground",
      info: "border-border bg-info text-info-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertTextVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      destructive: "text-destructive-foreground",
      solid: "text-background",
    },
    status: {
      error: "text-destructive-foreground",
      success: "text-success-foreground",
      warning: "text-warning-foreground",
      info: "text-info-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertDescriptionVariants = cva("text-sm", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      destructive: "text-destructive-foreground/80",
      solid: "text-background/80",
    },
    status: {
      error: "text-destructive-foreground/80",
      success: "text-success-foreground/80",
      warning: "text-warning-foreground/80",
      info: "text-info-foreground/80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const AlertContext = createContext<AlertVariantProps>({});

function Alert({
  className,
  variant,
  status,
  icon,
  iconClassName,
  children,
  ...props
}: AlertProps) {
  return (
    <AlertContext.Provider value={{ variant, status }}>
      <TextClassContext.Provider value={alertTextVariants({ variant, status })}>
        <ShadowBox
          size="md"
          role="alert"
          contentClassName={cn(
            "w-full flex-row items-start gap-3 rounded-md border-2 px-4 py-3",
            alertVariants({ variant, status }),
            className,
          )}
          {...props}
        >
          {icon ? (
            <Icon
              as={icon}
              size={20}
              className={cn("mt-0.5 shrink-0", iconClassName)}
            />
          ) : null}
          <View className="flex-1 gap-y-1">{children}</View>
        </ShadowBox>
      </TextClassContext.Provider>
    </AlertContext.Provider>
  );
}

function AlertTitle({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "min-h-5 font-head text-base leading-tight tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: ComponentProps<typeof Text>) {
  const { variant, status } = useContext(AlertContext);
  return (
    <Text
      className={cn(alertDescriptionVariants({ variant, status }), className)}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: ComponentProps<typeof View>) {
  return (
    <View className={cn("absolute right-2 top-2", className)} {...props} />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle, alertVariants };

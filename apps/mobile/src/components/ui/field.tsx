import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from "react";
import { View, type ViewProps } from "react-native";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const fieldVariants = cva("w-full gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-center",
      responsive: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const FieldContext = createContext({ invalid: false });

function FieldSet({ className, ...props }: ViewProps) {
  return (
    <View role="group" className={cn("flex-col gap-4", className)} {...props} />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: Omit<ComponentProps<typeof Text>, "variant"> & {
  variant?: "legend" | "label";
}) {
  return (
    <Text
      className={cn(
        "mb-1.5 font-head font-medium",
        variant === "label" ? "text-sm" : "text-base",
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: ViewProps) {
  return <View className={cn("w-full flex-col gap-5", className)} {...props} />;
}

function Field({
  className,
  orientation = "vertical",
  invalid = false,
  ...props
}: ViewProps &
  VariantProps<typeof fieldVariants> & {
    invalid?: boolean;
  }) {
  return (
    <FieldContext.Provider value={{ invalid }}>
      <View
        role="group"
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      />
    </FieldContext.Provider>
  );
}

function FieldContent({ className, ...props }: ViewProps) {
  return (
    <View className={cn("flex-1 flex-col gap-0.5", className)} {...props} />
  );
}

function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  const { invalid } = useContext(FieldContext);
  return (
    <Label
      className={cn("leading-snug", invalid && "text-destructive", className)}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: ComponentProps<typeof Text>) {
  const { invalid } = useContext(FieldContext);
  return (
    <Text
      className={cn(
        "font-head text-sm font-medium",
        invalid && "text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "text-sm font-normal leading-normal text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: ViewProps & {
  children?: ReactNode;
}) {
  return (
    <View
      role="separator"
      className={cn("relative -my-2 h-5 justify-center", className)}
      {...props}
    >
      <Separator className="absolute inset-x-0 top-2 h-0.5" />
      {children ? (
        <Text className="self-center bg-background px-2 text-sm text-muted-foreground">
          {children}
        </Text>
      ) : null}
    </View>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: ViewProps & {
  errors?: ({ message?: string } | undefined)[];
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }
    if (!errors?.length) {
      return null;
    }
    const uniqueMessages = [
      ...new Set(errors.map((error) => error?.message).filter(Boolean)),
    ] as string[];
    if (uniqueMessages.length === 0) {
      return null;
    }
    if (uniqueMessages.length === 1) {
      return uniqueMessages[0];
    }
    return (
      <View className="ml-2 flex-col gap-1">
        {uniqueMessages.map((message) => (
          <Text key={message} className="text-sm text-destructive">
            • {message}
          </Text>
        ))}
      </View>
    );
  }, [children, errors]);
  if (!content) {
    return null;
  }
  return (
    <View role="alert" className={className} {...props}>
      {typeof content === "string" ? (
        <Text className="text-sm font-normal text-destructive">{content}</Text>
      ) : (
        content
      )}
    </View>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};

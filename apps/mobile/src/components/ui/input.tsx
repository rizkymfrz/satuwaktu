import type { ComponentProps, RefAttributes } from "react";
import { Platform, TextInput, type TextInputInstance } from "react-native";
import { ShadowBox } from "@/components/ui/shadow-box";
import { useRevealOnFocus } from "@/lib/keyboard-reveal";
import { cn } from "@/lib/utils";

function Input({
  className,
  inputClassName,
  invalid = false,
  ...props
}: ComponentProps<typeof TextInput> &
  RefAttributes<TextInputInstance> & {
    inputClassName?: string;
    invalid?: boolean;
  }) {
  const disabled = props.editable === false;
  const reveal = useRevealOnFocus();
  return (
    <ShadowBox
      size="md"
      contentClassName={cn(
        "h-10 w-full min-w-0 flex-row items-center rounded-md border-2 border-border bg-input px-3",
        Platform.select({
          web: "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
        }),
        invalid && "border-destructive",
        disabled && "opacity-50",
        className,
      )}
    >
      <TextInput
        className={cn(
          "h-full flex-1 py-0 font-sans text-base leading-5 text-foreground placeholder:text-muted-foreground",
          Platform.select({
            web: cn(
              "outline-none",
              disabled && "pointer-events-none cursor-not-allowed",
            ),
          }),
          inputClassName,
        )}
        {...props}
        onFocus={(event) => {
          reveal?.();
          props.onFocus?.(event);
        }}
      />
    </ShadowBox>
  );
}

export { Input };

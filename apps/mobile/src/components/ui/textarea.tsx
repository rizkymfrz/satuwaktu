import type { ComponentProps, RefAttributes } from "react";
import { Platform, TextInput, type TextInputInstance } from "react-native";
import { ShadowBox } from "@/components/ui/shadow-box";
import { useRevealOnFocus } from "@/lib/keyboard-reveal";
import { cn } from "@/lib/utils";

function Textarea({
  className,
  inputClassName,
  invalid = false,
  multiline = true,
  numberOfLines = Platform.select({ web: 2, native: 4 }),
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
        "min-h-16 w-full min-w-0 rounded-md border-2 border-border bg-input px-3 py-2",
        invalid && "border-destructive",
        disabled && "opacity-50",
        Platform.select({
          web: "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
        }),
        className,
      )}
    >
      <TextInput
        className={cn(
          "min-h-12 w-full flex-1 p-0 font-sans text-base leading-5 text-foreground placeholder:text-muted-foreground",
          Platform.select({
            web: cn(
              "field-sizing-content resize-y outline-none",
              disabled && "pointer-events-none cursor-not-allowed",
            ),
          }),
          inputClassName,
        )}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
        onFocus={(event) => {
          reveal?.();
          props.onFocus?.(event);
        }}
      />
    </ShadowBox>
  );
}

export { Textarea };

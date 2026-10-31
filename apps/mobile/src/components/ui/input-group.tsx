import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useRef,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from "react";
import {
  Platform,
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputInstance,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text, TextClassContext } from "@/components/ui/text";
import { useRevealOnFocus } from "@/lib/keyboard-reveal";
import { cn } from "@/lib/utils";

type InputGroupContextProps = {
  disabled: boolean;
  inputRef: RefObject<TextInputInstance | null>;
};

const InputGroupContext = createContext<InputGroupContextProps | null>(null);

function useInputGroup() {
  const context = useContext(InputGroupContext);
  if (!context) {
    throw new Error("InputGroup components must be used within <InputGroup />");
  }
  return context;
}

type InputGroupAddonAlign =
  "inline-start" | "inline-end" | "block-start" | "block-end";

const ADDON_STYLE: Record<InputGroupAddonAlign, ViewStyle> = {
  "inline-start": { paddingLeft: 12, marginRight: -6 },
  "inline-end": { paddingRight: 12, marginLeft: -6 },
  "block-start": { paddingHorizontal: 12, paddingTop: 10 },
  "block-end": { paddingHorizontal: 12, paddingBottom: 10 },
};

const ADDON_CLASS: Record<InputGroupAddonAlign, string> = {
  "inline-start": "",
  "inline-end": "",
  "block-start": "w-full justify-between",
  "block-end": "w-full justify-between",
};

function isBlockLayout(children: ReactNode) {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) {
      return false;
    }
    if (child.type === InputGroupTextarea) {
      return true;
    }
    if (child.type === InputGroupAddon) {
      const align = (child.props as { align?: string }).align;
      return align === "block-start" || align === "block-end";
    }
    return false;
  });
}

function InputGroup({
  className,
  children,
  invalid = false,
  disabled = false,
  ...props
}: ViewProps & {
  invalid?: boolean;
  disabled?: boolean;
}) {
  const inputRef = useRef<TextInputInstance>(null);
  const block = isBlockLayout(children);
  return (
    <InputGroupContext.Provider value={{ disabled, inputRef }}>
      <TextClassContext.Provider value="text-sm text-muted-foreground">
        <ShadowBox
          size="md"
          className="mb-1 mr-1"
          role="group"
          contentClassName={cn(
            "w-full min-w-0 rounded-md border-2 border-border bg-input",
            block ? "flex-col" : "h-10 flex-row items-center",
            invalid && "border-destructive",
            disabled && "opacity-50",
            Platform.select({
              web: "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
            }),
            className,
          )}
          {...props}
        >
          {children}
        </ShadowBox>
      </TextClassContext.Provider>
    </InputGroupContext.Provider>
  );
}

function InputGroupAddon({
  className,
  align = "inline-start",
  style,
  children,
  ...props
}: Omit<ComponentProps<typeof Pressable>, "children"> & {
  align?: InputGroupAddonAlign;
  children?: ReactNode;
}) {
  const { inputRef } = useInputGroup();
  return (
    <Pressable
      role="group"
      accessible={false}
      onPress={() => inputRef.current?.focus()}
      style={[ADDON_STYLE[align], style as StyleProp<ViewStyle>]}
      {...props}
    >
      <View
        className={cn(
          "flex-row items-center gap-2",
          ADDON_CLASS[align],
          className,
        )}
      >
        {children}
      </View>
    </Pressable>
  );
}

function InputGroupButton({
  variant = "ghost",
  size = "xs",
  ...props
}: ButtonProps) {
  const shadowed = variant !== "ghost" && variant !== "link";
  return (
    <View className={cn(shadowed && "mb-1 mr-1")}>
      <Button variant={variant} size={size} {...props} />
    </View>
  );
}

function InputGroupText({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: Omit<ComponentProps<typeof TextInput>, "editable">) {
  const { inputRef, disabled } = useInputGroup();
  const reveal = useRevealOnFocus();
  return (
    <TextInput
      ref={inputRef}
      editable={!disabled}
      className={cn(
        "h-full flex-1 px-3 py-0 font-sans text-base leading-5 text-foreground placeholder:text-muted-foreground",
        Platform.select({ web: "outline-none" }),
        className,
      )}
      {...props}
      onFocus={(event) => {
        reveal?.();
        props.onFocus?.(event);
      }}
    />
  );
}

function InputGroupTextarea({
  className,
  numberOfLines = 3,
  ...props
}: Omit<ComponentProps<typeof TextInput>, "editable">) {
  const { inputRef, disabled } = useInputGroup();
  const reveal = useRevealOnFocus();
  return (
    <TextInput
      ref={inputRef}
      editable={!disabled}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      className={cn(
        "min-h-20 w-full px-3 py-2 font-sans text-base leading-5 text-foreground placeholder:text-muted-foreground",
        Platform.select({ web: "resize-none outline-none" }),
        className,
      )}
      {...props}
      onFocus={(event) => {
        reveal?.();
        props.onFocus?.(event);
      }}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};

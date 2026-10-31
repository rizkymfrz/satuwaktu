import { Minus } from "lucide-react-native";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  type TextInputInstance,
  type ViewProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text } from "@/components/ui/text";
import { useRevealOnFocus } from "@/lib/keyboard-reveal";
import { cn } from "@/lib/utils";

type InputOTPContextProps = {
  value: string;
  maxLength: number;
  focused: boolean;
  disabled: boolean;
  invalid: boolean;
};

type SlotPosition = "first" | "middle" | "last" | "only";

const InputOTPContext = createContext<InputOTPContextProps | null>(null);

function useInputOTP() {
  const context = useContext(InputOTPContext);
  if (!context) {
    throw new Error("InputOTP components must be used within <InputOTP />");
  }
  return context;
}

function InputOTP({
  className,
  children,
  maxLength,
  value: valueProp,
  defaultValue = "",
  onChange,
  onComplete,
  pattern,
  disabled = false,
  invalid = false,
  autoFocus,
  keyboardType = "number-pad",
}: {
  className?: string;
  children?: ReactNode;
  maxLength: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  pattern?: RegExp;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  keyboardType?: ComponentProps<typeof TextInput>["keyboardType"];
}) {
  const inputRef = useRef<TextInputInstance>(null);
  const reveal = useRevealOnFocus();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const value = valueProp ?? internalValue;
  function changeText(text: string) {
    const matcher = pattern
      ? new RegExp(pattern.source, pattern.flags.replace("g", ""))
      : null;
    const next = [...text]
      .filter((char) => (matcher ? matcher.test(char) : true))
      .join("")
      .slice(0, maxLength);
    if (valueProp === undefined) {
      setInternalValue(next);
    }
    onChange?.(next);
    if (next.length === maxLength) {
      onComplete?.(next);
    }
  }
  return (
    <InputOTPContext.Provider
      value={{ value, maxLength, focused, disabled, invalid }}
    >
      <View
        className={cn(
          "relative flex-row items-center gap-2",
          disabled && "opacity-50",
          className,
        )}
      >
        {children}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={changeText}
          editable={!disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          keyboardType={keyboardType}
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          autoCorrect={false}
          caretHidden
          selectionColor="transparent"
          onFocus={() => {
            setFocused(true);
            reveal?.();
          }}
          onBlur={() => setFocused(false)}
          style={[StyleSheet.absoluteFill, { color: "transparent" }]}
          className={cn(Platform.select({ web: "cursor-text outline-none" }))}
        />
      </View>
    </InputOTPContext.Provider>
  );
}

function InputOTPGroup({
  className,
  children,
  ...props
}: ViewProps & { children?: ReactNode }) {
  const { invalid } = useInputOTP();
  const items = Children.toArray(children);
  return (
    <ShadowBox
      size="md"
      className="mb-1 mr-1"
      contentClassName={cn(
        "flex-row items-center overflow-hidden rounded-md border-2 border-border",
        invalid && "border-destructive",
        className,
      )}
      {...props}
    >
      {items.map((child, index) => {
        if (!isValidElement(child)) {
          return child;
        }
        const position: SlotPosition =
          items.length === 1
            ? "only"
            : index === 0
              ? "first"
              : index === items.length - 1
                ? "last"
                : "middle";
        return cloneElement(
          child as ReactElement<{ position?: SlotPosition }>,
          { position },
        );
      })}
    </ShadowBox>
  );
}

function Caret() {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.set(
      withRepeat(
        withSequence(
          withTiming(0, { duration: 500 }),
          withTiming(1, { duration: 500 }),
        ),
        -1,
      ),
    );
  }, [opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      pointerEvents="none"
      className="h-5 w-0.5 bg-foreground"
      style={style}
    />
  );
}

function InputOTPSlot({
  index,
  position = "middle",
  className,
  ...props
}: ViewProps & {
  index: number;
  position?: SlotPosition;
}) {
  const { value, maxLength, focused, invalid } = useInputOTP();
  const char = value[index];
  const activeIndex = Math.min(value.length, maxLength - 1);
  const isActive = focused && index === activeIndex;
  const hasFakeCaret = isActive && value.length < maxLength && !char;
  return (
    <View
      className={cn(
        "size-10 items-center justify-center bg-input",
        position !== "last" &&
          position !== "only" &&
          "border-r-2 border-border",
        invalid &&
          position !== "last" &&
          position !== "only" &&
          "border-destructive",
        className,
      )}
      {...props}
    >
      {char ? <Text className="text-base">{char}</Text> : null}
      {hasFakeCaret ? <Caret /> : null}
      {isActive ? (
        <View
          pointerEvents="none"
          className="absolute inset-0 border-2 border-primary"
        />
      ) : null}
    </View>
  );
}

function InputOTPSeparator({ ...props }: ViewProps) {
  return (
    <View role="separator" className="items-center justify-center" {...props}>
      <Icon as={Minus} size={16} />
    </View>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };

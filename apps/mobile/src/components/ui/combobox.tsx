import { Check, ChevronDown, ChevronUp, Plus, X } from "lucide-react-native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
  type TextInputInstance,
  type ViewProps,
} from "react-native";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text, TextClassContext } from "@/components/ui/text";
import { useRevealOnFocus } from "@/lib/keyboard-reveal";
import { cn } from "@/lib/utils";

type ComboboxContextProps = {
  multiple: boolean;
  disabled: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: string[];
  labelOf: (value: string) => string;
  registerLabel: (value: string, label: string) => void;
  query: string;
  typed: string;
  hasLabel: (text: string) => boolean;
  inputText: string;
  changeText: (text: string) => void;
  select: (value: string, label: string) => void;
  remove: (value: string) => void;
  clear: () => void;
  visibleCount: number;
  setItemVisible: (id: string, visible: boolean) => void;
  inputRef: RefObject<TextInputInstance | null>;
};

type ComboboxBaseProps = {
  children?: ReactNode;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type ComboboxProps = ComboboxBaseProps &
  (
    | {
        multiple?: false;
        value?: string | null;
        defaultValue?: string | null;
        onValueChange?: (value: string | null) => void;
      }
    | {
        multiple: true;
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
  );

const ComboboxContext = createContext<ComboboxContextProps | null>(null);

function useCombobox() {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error("Combobox components must be used within a <Combobox />");
  }
  return context;
}

function toArray(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}

function Combobox({
  children,
  disabled = false,
  open: openProp,
  onOpenChange,
  ...props
}: ComboboxProps) {
  const multiple = props.multiple === true;
  const inputRef = useRef<TextInputInstance>(null);
  const [internalSelected, setInternalSelected] = useState<string[]>(
    toArray(props.defaultValue),
  );
  const [internalOpen, setInternalOpen] = useState(false);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [filtering, setFiltering] = useState(false);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const selected =
    props.value === undefined ? internalSelected : toArray(props.value);
  const open = openProp ?? internalOpen;
  function setOpen(next: boolean) {
    setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setFiltering(false);
      setInputValue("");
    }
  }
  function labelOf(value: string) {
    return labels[value] ?? value;
  }
  const registerLabel = useCallback(
    (value: string, label: string) => {
      setLabels((prev) =>
        prev[value] === label ? prev : { ...prev, [value]: label },
      );
    },
    [setLabels],
  );
  const setItemVisible = useCallback(
    (id: string, visible: boolean) => {
      setVisibleIds((prev) => {
        if (prev.has(id) === visible) {
          return prev;
        }
        const next = new Set(prev);
        if (visible) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    },
    [setVisibleIds],
  );
  function commit(next: string[]) {
    if (props.value === undefined) {
      setInternalSelected(next);
    }
    if (props.multiple) {
      props.onValueChange?.(next);
    } else {
      props.onValueChange?.(next[0] ?? null);
    }
  }
  function select(value: string, label: string) {
    registerLabel(value, label);
    if (multiple) {
      commit(
        selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      );
      setFiltering(false);
      setInputValue("");
      return;
    }
    commit([value]);
    setOpen(false);
  }
  function remove(value: string) {
    commit(selected.filter((item) => item !== value));
  }
  function clear() {
    commit([]);
    setFiltering(false);
    setInputValue("");
  }
  function changeText(text: string) {
    setInputValue(text);
    setFiltering(true);
    if (!open) {
      setOpen(true);
    }
  }
  const typed = filtering ? inputValue.trim() : "";
  const query = typed.toLowerCase();
  function hasLabel(text: string) {
    const needle = text.trim().toLowerCase();
    return Object.values(labels).some(
      (label) => label.toLowerCase() === needle,
    );
  }
  const inputText =
    filtering || multiple ? inputValue : labelOf(selected[0] ?? "");
  return (
    <ComboboxContext.Provider
      value={{
        multiple,
        disabled,
        open,
        setOpen,
        selected,
        labelOf,
        registerLabel,
        query,
        typed,
        hasLabel,
        inputText,
        changeText,
        select,
        remove,
        clear,
        visibleCount: visibleIds.size,
        setItemVisible,
        inputRef,
      }}
    >
      <View>{children}</View>
    </ComboboxContext.Provider>
  );
}

function ComboboxValue({
  children,
  className,
}: {
  children?: ((value: string[]) => ReactNode) | ReactNode;
  className?: string;
}) {
  const { selected, labelOf } = useCombobox();
  if (typeof children === "function") {
    return <>{children(selected)}</>;
  }
  if (children !== undefined) {
    return <>{children}</>;
  }
  return (
    <Text className={cn("text-sm", className)}>
      {selected.map(labelOf).join(", ")}
    </Text>
  );
}

function ComboboxTrigger({
  className,
  ...props
}: ComponentProps<typeof Pressable>) {
  const { open, setOpen, disabled } = useCombobox();
  return (
    <Pressable
      role="button"
      aria-label="Toggle options"
      aria-expanded={open}
      disabled={disabled}
      hitSlop={8}
      className={cn("items-center justify-center", className)}
      onPress={() => setOpen(!open)}
      {...props}
    >
      <Icon
        as={open ? ChevronUp : ChevronDown}
        size={16}
        className="text-muted-foreground"
      />
    </Pressable>
  );
}

function ComboboxClear({
  className,
  ...props
}: ComponentProps<typeof Pressable>) {
  const { clear, disabled } = useCombobox();
  return (
    <Pressable
      role="button"
      aria-label="Clear"
      disabled={disabled}
      hitSlop={8}
      className={cn("items-center justify-center", className)}
      onPress={clear}
      {...props}
    >
      <Icon as={X} size={16} className="text-muted-foreground" />
    </Pressable>
  );
}

function ComboboxInput({
  className,
  showTrigger = true,
  showClear = false,
  closeOnBlur = true,
  placeholder,
  onFocus,
  onBlur,
  ...props
}: Omit<
  ComponentProps<typeof TextInput>,
  "value" | "onChangeText" | "editable"
> & {
  showTrigger?: boolean;
  showClear?: boolean;
  closeOnBlur?: boolean;
}) {
  const { inputRef, inputText, changeText, setOpen, disabled, selected } =
    useCombobox();
  const reveal = useRevealOnFocus();
  return (
    <ShadowBox
      size="md"
      contentClassName={cn(
        "h-10 flex-row items-center gap-2 rounded-md border-2 border-border bg-input px-3",
        disabled && "opacity-50",
        className,
      )}
    >
      <TextInput
        ref={inputRef}
        role="combobox"
        editable={!disabled}
        value={inputText}
        placeholder={placeholder}
        onChangeText={changeText}
        onFocus={(event) => {
          setOpen(true);
          reveal?.();
          onFocus?.(event);
        }}
        onBlur={(event) => {
          if (closeOnBlur) {
            setOpen(false);
          }
          onBlur?.(event);
        }}
        className={cn(
          "h-full flex-1 py-0 font-sans text-base leading-5 text-foreground placeholder:text-muted-foreground",
          Platform.select({ web: "outline-none" }),
        )}
        {...props}
      />
      {showClear && selected.length > 0 ? <ComboboxClear /> : null}
      {showTrigger ? <ComboboxTrigger /> : null}
    </ShadowBox>
  );
}

function ComboboxContent({ className, children, ...props }: ViewProps) {
  const { open } = useCombobox();
  return (
    <View
      className="mr-1 mt-3 mb-1"
      style={open ? undefined : { display: "none" }}
      {...props}
    >
      <TextClassContext.Provider value="text-sm text-popover-foreground">
        <ShadowBox
          size="md"
          contentClassName={cn(
            "overflow-hidden rounded-md border-2 border-border bg-popover",
            className,
          )}
        >
          {children}
        </ShadowBox>
      </TextClassContext.Provider>
    </View>
  );
}

function ComboboxList({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <ScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      style={{ maxHeight: 240 }}
      contentContainerClassName={cn("p-1", className)}
    >
      {children}
    </ScrollView>
  );
}

function ComboboxItem({
  className,
  children,
  value,
  label,
  disabled = false,
  ...props
}: Omit<ComponentProps<typeof Pressable>, "children"> & {
  value: string;
  label?: string;
  disabled?: boolean;
  children?: ReactNode;
}) {
  const { selected, select, query, registerLabel, setItemVisible } =
    useCombobox();
  const id = useId();
  const resolvedLabel =
    label ?? (typeof children === "string" ? children : value);
  const isSelected = selected.includes(value);
  const matches = query === "" || resolvedLabel.toLowerCase().includes(query);
  useEffect(() => {
    registerLabel(value, resolvedLabel);
  }, [value, resolvedLabel, registerLabel]);
  useEffect(() => {
    setItemVisible(id, matches);
    return () => setItemVisible(id, false);
  }, [id, matches, setItemVisible]);
  if (!matches) {
    return null;
  }
  return (
    <Pressable
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      onPress={() => select(value, resolvedLabel)}
      className={cn(
        "relative flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 active:bg-accent",
        Platform.select({ web: "cursor-pointer outline-none hover:bg-accent" }),
        isSelected && "bg-accent",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="text-sm">{children}</Text>
      ) : (
        children
      )}
      {isSelected ? (
        <View className="absolute right-2 size-4 items-center justify-center">
          <Icon as={Check} size={16} />
        </View>
      ) : null}
    </Pressable>
  );
}

function ComboboxCreate({
  className,
  label = (text) => `Buat "${text}"`,
  onCreate,
  ...props
}: Omit<ComponentProps<typeof Pressable>, "children" | "onPress"> & {
  label?: (text: string) => string;
  onCreate?: (text: string) => void;
}) {
  const { typed, hasLabel, select } = useCombobox();
  if (!typed || hasLabel(typed)) {
    return null;
  }
  return (
    <Pressable
      role="button"
      onPress={() => {
        onCreate?.(typed);
        select(typed, typed);
      }}
      className={cn(
        "flex-row items-center gap-2 rounded-sm px-2 py-2 active:bg-accent",
        Platform.select({ web: "cursor-pointer outline-none hover:bg-accent" }),
        className,
      )}
      {...props}
    >
      <Icon as={Plus} size={16} />
      <Text numberOfLines={1} className="flex-1 text-sm font-medium">
        {label(typed)}
      </Text>
    </Pressable>
  );
}

function ComboboxGroup({ className, ...props }: ViewProps) {
  return <View role="group" className={cn(className)} {...props} />;
}

function ComboboxLabel({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function ComboboxEmpty({
  className,
  children,
  ...props
}: ComponentProps<typeof Text>) {
  const { visibleCount } = useCombobox();
  if (visibleCount > 0) {
    return null;
  }
  return (
    <Text
      className={cn(
        "w-full py-2 text-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? "No items found."}
    </Text>
  );
}

function ComboboxSeparator({ className, ...props }: ViewProps) {
  return (
    <View
      role="separator"
      className={cn("-mx-1 my-1 h-0.5 bg-border", className)}
      {...props}
    />
  );
}

function ComboboxChips({
  className,
  children,
  showTrigger = true,
  style,
  ...props
}: ViewProps & { showTrigger?: boolean }) {
  const { disabled } = useCombobox();
  return (
    <ShadowBox
      size="md"
      contentClassName={cn(
        "flex-row flex-wrap items-center gap-1 rounded-md border-2 border-border bg-input",
        disabled && "opacity-50",
        className,
      )}
      style={[
        {
          minHeight: 40,
          paddingVertical: 2,
          paddingLeft: 8,
          paddingRight: showTrigger ? 36 : 8,
        },
        style,
      ]}
      {...props}
    >
      {children}
      {showTrigger ? (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            right: 10,
            top: 0,
            height: 36,
            justifyContent: "center",
          }}
        >
          <ComboboxTrigger />
        </View>
      ) : null}
    </ShadowBox>
  );
}

function ComboboxChip({
  className,
  children,
  value,
  showRemove = true,
  ...props
}: ViewProps & {
  value: string;
  showRemove?: boolean;
}) {
  const { remove, disabled } = useCombobox();
  return (
    <View
      className={cn(
        "h-6 flex-row items-center gap-1 rounded-sm border-2 border-border bg-muted pl-1.5",
        showRemove ? "pr-0.5" : "pr-1.5",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="font-head text-xs font-medium">{children}</Text>
      ) : (
        children
      )}
      {showRemove ? (
        <Pressable
          role="button"
          aria-label="Remove"
          disabled={disabled}
          hitSlop={8}
          className="items-center justify-center"
          onPress={() => remove(value)}
        >
          <Icon as={X} size={12} className="text-muted-foreground" />
        </Pressable>
      ) : null}
    </View>
  );
}

function ComboboxChipsInput({
  className,
  placeholder,
  onFocus,
  onBlur,
  ...props
}: Omit<
  ComponentProps<typeof TextInput>,
  "value" | "onChangeText" | "editable"
>) {
  const { inputRef, inputText, changeText, setOpen, disabled } = useCombobox();
  const reveal = useRevealOnFocus();
  return (
    <TextInput
      ref={inputRef}
      role="combobox"
      editable={!disabled}
      value={inputText}
      placeholder={placeholder}
      onChangeText={changeText}
      onFocus={(event) => {
        setOpen(true);
        reveal?.();
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setOpen(false);
        onBlur?.(event);
      }}
      className={cn(
        "h-7 min-w-16 flex-1 px-1 py-0 font-sans text-base leading-5 text-foreground placeholder:text-muted-foreground",
        Platform.select({ web: "outline-none" }),
        className,
      )}
      {...props}
    />
  );
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxContent,
  ComboboxCreate,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
};

export type { ComboboxProps };

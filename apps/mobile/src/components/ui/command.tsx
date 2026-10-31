import { Check, Search } from "lucide-react-native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
  type ViewProps,
} from "react-native";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text, TextClassContext } from "@/components/ui/text";
import { useRevealOnFocus } from "@/lib/keyboard-reveal";
import { cn } from "@/lib/utils";

type CommandContextProps = {
  query: string;
  search: string;
  setSearch: (search: string) => void;
  visibleCount: number;
  setItemVisible: (id: string, visible: boolean) => void;
};

type CommandGroupContextProps = {
  setItemVisible: (id: string, visible: boolean) => void;
};

const CommandContext = createContext<CommandContextProps | null>(null);

const CommandGroupContext = createContext<CommandGroupContextProps | null>(
  null,
);

function useCommand() {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("Command components must be used within a <Command />");
  }
  return context;
}

function useVisibleIds() {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const setItemVisible = useCallback((id: string, visible: boolean) => {
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
  }, []);
  return { visibleCount: visibleIds.size, setItemVisible };
}

function Command({
  className,
  children,
  shadow = true,
  ...props
}: ViewProps & { shadow?: boolean }) {
  const [search, setSearch] = useState("");
  const { visibleCount, setItemVisible } = useVisibleIds();
  const contentClassName = cn(
    "w-full overflow-hidden rounded-md border-2 border-border bg-popover p-1",
    className,
  );
  return (
    <CommandContext.Provider
      value={{
        query: search.trim().toLowerCase(),
        search,
        setSearch,
        visibleCount,
        setItemVisible,
      }}
    >
      <TextClassContext.Provider value="text-sm text-popover-foreground">
        {shadow ? (
          <ShadowBox
            size="md"
            className="mb-1 mr-1"
            contentClassName={contentClassName}
            {...props}
          >
            {children}
          </ShadowBox>
        ) : (
          <View className={contentClassName} {...props}>
            {children}
          </View>
        )}
      </TextClassContext.Provider>
    </CommandContext.Provider>
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "w-full max-w-md gap-0 overflow-hidden rounded-md border-2 border-border p-0",
          className,
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  onChangeText,
  ...props
}: Omit<ComponentProps<typeof TextInput>, "value">) {
  const { search, setSearch } = useCommand();
  const reveal = useRevealOnFocus();
  return (
    <View className="h-10 flex-row items-center gap-2 rounded-md border-2 border-border bg-input px-3">
      <Icon as={Search} size={16} className="text-muted-foreground" />
      <TextInput
        role="combobox"
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          onChangeText?.(text);
        }}
        className={cn(
          "h-full flex-1 py-0 font-sans text-base leading-5 text-foreground placeholder:text-muted-foreground",
          Platform.select({ web: "outline-none" }),
          className,
        )}
        {...props}
        onFocus={(event) => {
          reveal?.();
          props.onFocus?.(event);
        }}
      />
    </View>
  );
}

function CommandList({
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
      style={{ maxHeight: 288 }}
      contentContainerClassName={cn("pt-1", className)}
    >
      {children}
    </ScrollView>
  );
}

function CommandEmpty({
  className,
  children,
  ...props
}: ComponentProps<typeof Text>) {
  const { visibleCount } = useCommand();
  if (visibleCount > 0) {
    return null;
  }
  return (
    <Text
      className={cn("w-full py-6 text-center text-sm", className)}
      {...props}
    >
      {children ?? "No results found."}
    </Text>
  );
}

function CommandGroup({
  className,
  children,
  heading,
  ...props
}: ViewProps & { heading?: ReactNode }) {
  const { query } = useCommand();
  const { visibleCount, setItemVisible } = useVisibleIds();
  const hidden = query !== "" && visibleCount === 0;
  return (
    <CommandGroupContext.Provider value={{ setItemVisible }}>
      <View
        role="group"
        className={cn("overflow-hidden p-1", className)}
        style={hidden ? { display: "none" } : undefined}
        {...props}
      >
        {heading ? (
          typeof heading === "string" ? (
            <Text className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              {heading}
            </Text>
          ) : (
            heading
          )
        ) : null}
        {children}
      </View>
    </CommandGroupContext.Provider>
  );
}

function CommandSeparator({ className, ...props }: ViewProps) {
  return (
    <View
      role="separator"
      className={cn("-mx-1 h-0.5 bg-border", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  value,
  keywords,
  checked = false,
  disabled = false,
  onSelect,
  ...props
}: Omit<ComponentProps<typeof Pressable>, "children"> & {
  value?: string;
  keywords?: string[];
  checked?: boolean;
  disabled?: boolean;
  onSelect?: (value: string) => void;
  children?: ReactNode;
}) {
  const { query, setItemVisible } = useCommand();
  const group = useContext(CommandGroupContext);
  const id = useId();
  const resolvedValue = value ?? (typeof children === "string" ? children : id);
  const haystack = [resolvedValue, ...(keywords ?? [])].join(" ").toLowerCase();
  const matches = query === "" || haystack.includes(query);
  useEffect(() => {
    setItemVisible(id, matches);
    group?.setItemVisible(id, matches);
    return () => {
      setItemVisible(id, false);
      group?.setItemVisible(id, false);
    };
  }, [id, matches, setItemVisible, group]);
  if (!matches) {
    return null;
  }
  return (
    <Pressable
      role="option"
      aria-selected={checked}
      disabled={disabled}
      onPress={() => onSelect?.(resolvedValue)}
      className={cn(
        "relative flex-row items-center gap-2 rounded-sm px-2 py-2 active:bg-accent",
        Platform.select({ web: "cursor-pointer outline-none hover:bg-accent" }),
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
      {checked ? (
        <View className="ml-auto size-4 items-center justify-center">
          <Icon as={Check} size={16} />
        </View>
      ) : null}
    </Pressable>
  );
}

function CommandShortcut({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};

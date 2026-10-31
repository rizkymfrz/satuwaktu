import {
  CircleCheck,
  Info,
  OctagonX,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react-native";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { View } from "react-native";
import {
  FadeInDown,
  FadeInUp,
  FadeOut,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type ToastType =
  "default" | "success" | "info" | "warning" | "error" | "loading";

type ToastPosition = "top" | "bottom";
type ToastButton = { label: string; onPress?: () => void };

type ToastOptions = {
  id?: string | number;
  description?: string;
  duration?: number;
  action?: ToastButton;
  cancel?: ToastButton;
  icon?: ReactNode;
};

type ToastData = ToastOptions & {
  id: string | number;
  type: ToastType;
  title: string;
};

const DEFAULT_DURATION = 4000;
const MAX_VISIBLE = 3;

const TYPE_ICON: Partial<
  Record<ToastType, { icon: LucideIcon; className: string }>
> = {
  success: { icon: CircleCheck, className: "text-success" },
  info: { icon: Info, className: "text-info" },
  warning: { icon: TriangleAlert, className: "text-warning" },
  error: { icon: OctagonX, className: "text-destructive" },
};

let toasts: ToastData[] = [];
let counter = 0;
const listeners = new Set<() => void>();

function emit(next: ToastData[]) {
  toasts = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return toasts;
}

function show(type: ToastType, title: string, options: ToastOptions = {}) {
  const id = options.id ?? ++counter;
  const data: ToastData = { ...options, id, type, title };
  const exists = toasts.some((item) => item.id === id);
  emit(
    exists
      ? toasts.map((item) => (item.id === id ? data : item))
      : [...toasts, data],
  );
  return id;
}

function dismiss(id?: string | number) {
  emit(id === undefined ? [] : toasts.filter((item) => item.id !== id));
}

function toast(title: string, options?: ToastOptions) {
  return show("default", title, options);
}

toast.success = (title: string, options?: ToastOptions) =>
  show("success", title, options);
toast.info = (title: string, options?: ToastOptions) =>
  show("info", title, options);
toast.warning = (title: string, options?: ToastOptions) =>
  show("warning", title, options);
toast.error = (title: string, options?: ToastOptions) =>
  show("error", title, options);
toast.loading = (title: string, options?: ToastOptions) =>
  show("loading", title, options);
toast.dismiss = dismiss;

function ToastItem({
  data,
  position,
}: {
  data: ToastData;
  position: ToastPosition;
}) {
  const { id, type, title, description, action, cancel, icon } = data;
  const duration = data.duration ?? DEFAULT_DURATION;
  useEffect(() => {
    if (type === "loading" || !Number.isFinite(duration)) {
      return;
    }
    const timer = setTimeout(() => dismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, type, duration, title, description]);
  const typed = TYPE_ICON[type];
  let leading: ReactNode = icon ?? null;
  if (!leading && type === "loading") {
    leading = <Spinner size={18} />;
  } else if (!leading && typed) {
    leading = <Icon as={typed.icon} size={18} className={typed.className} />;
  }
  function press(button: ToastButton) {
    button.onPress?.();
    dismiss(id);
  }
  return (
    <NativeOnlyAnimatedView
      layout={LinearTransition}
      entering={(position === "top" ? FadeInUp : FadeInDown)
        .duration(200)
        .reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
      style={{ width: "100%" }}
    >
      <ShadowBox
        size="md"
        contentClassName="w-full flex-row items-center gap-3 rounded-md border-2 border-border bg-popover p-4"
      >
        {leading ? <View className="shrink-0">{leading}</View> : null}
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="font-head text-sm font-medium text-popover-foreground">
            {title}
          </Text>
          {description ? (
            <Text className="text-sm text-muted-foreground">{description}</Text>
          ) : null}
        </View>
        {cancel ? (
          <Button variant="secondary" size="xs" onPress={() => press(cancel)}>
            <Text>{cancel.label}</Text>
          </Button>
        ) : null}
        {action ? (
          <Button size="xs" onPress={() => press(action)}>
            <Text>{action.label}</Text>
          </Button>
        ) : null}
      </ShadowBox>
    </NativeOnlyAnimatedView>
  );
}

function Toaster({
  position = "top",
  className,
}: {
  position?: ToastPosition;
  className?: string;
}) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const insets = useSafeAreaInsets();
  const visible = items.slice(-MAX_VISIBLE);
  const ordered = position === "top" ? [...visible].reverse() : visible;
  return (
    <View
      pointerEvents="box-none"
      className={cn(
        "absolute left-0 right-0 z-50 items-center gap-3 px-4",
        position === "top" ? "top-0" : "bottom-0",
        className,
      )}
      style={
        position === "top"
          ? { paddingTop: insets.top + 8 }
          : { paddingBottom: insets.bottom + 8 }
      }
    >
      {ordered.map((item) => (
        <ToastItem key={item.id} data={item} position={position} />
      ))}
    </View>
  );
}

export { toast, Toaster };
export type { ToastOptions, ToastPosition };

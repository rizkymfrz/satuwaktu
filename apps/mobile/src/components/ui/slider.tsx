import { useRef, useState } from "react";
import {
  PanResponder,
  View,
  type LayoutChangeEvent,
  type ViewProps,
} from "react-native";
import { ShadowBox } from "@/components/ui/shadow-box";
import { useScrollLock } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";

const THUMB_SIZE = 18;

type SliderProps = Omit<ViewProps, "children"> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  thumbClassName?: string;
  rangeClassName?: string;
};

function Slider({
  className,
  thumbClassName,
  rangeClassName,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  ...props
}: SliderProps) {
  const [internal, setInternal] = useState<number[]>(defaultValue ?? [min]);
  const [width, setWidth] = useState(0);
  const lockScroll = useScrollLock();
  const values = value ?? internal;
  const latest = useRef({
    lockScroll,
    values,
    width,
    min,
    max,
    step,
    disabled,
    controlled: value !== undefined,
    onValueChange,
    onValueCommit,
  });
  latest.current = {
    lockScroll,
    values,
    width,
    min,
    max,
    step,
    disabled,
    controlled: value !== undefined,
    onValueChange,
    onValueCommit,
  };
  const drag = useRef({ startX: 0, index: 0 });
  function toValue(x: number) {
    const { width: w, min: lo, max: hi, step: st } = latest.current;
    const usable = Math.max(w - THUMB_SIZE, 1);
    const ratio = Math.min(Math.max((x - THUMB_SIZE / 2) / usable, 0), 1);
    const snapped = Math.round((lo + ratio * (hi - lo) - lo) / st) * st + lo;
    return Math.min(Math.max(snapped, lo), hi);
  }
  function update(index: number, next: number) {
    const current = latest.current;
    const lower = index > 0 ? current.values[index - 1] : current.min;
    const upper =
      index < current.values.length - 1
        ? current.values[index + 1]
        : current.max;
    const clamped = Math.min(Math.max(next, lower), upper);
    if (clamped === current.values[index]) {
      return;
    }
    const nextValues = current.values.map((v, i) =>
      i === index ? clamped : v,
    );
    if (!current.controlled) {
      setInternal(nextValues);
    }
    current.onValueChange?.(nextValues);
  }
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.disabled,
      onMoveShouldSetPanResponder: () => !latest.current.disabled,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        latest.current.lockScroll(true);
        const x = event.nativeEvent.locationX;
        const target = toValue(x);
        const { values: current } = latest.current;
        let index = 0;
        current.forEach((v, i) => {
          if (Math.abs(v - target) < Math.abs(current[index] - target)) {
            index = i;
          }
        });
        drag.current = { startX: x, index };
        update(index, target);
      },
      onPanResponderMove: (_event, gesture) => {
        update(drag.current.index, toValue(drag.current.startX + gesture.dx));
      },
      onPanResponderRelease: () => {
        latest.current.lockScroll(false);
        latest.current.onValueCommit?.(latest.current.values);
      },
      onPanResponderTerminate: () => {
        latest.current.lockScroll(false);
      },
    }),
  ).current;
  function onLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }
  function positionOf(v: number) {
    const range = max - min || 1;
    return ((v - min) / range) * Math.max(width - THUMB_SIZE, 0);
  }
  const first = positionOf(values[0] ?? min);
  const last = positionOf(values[values.length - 1] ?? min);
  const rangeStart = values.length > 1 ? first + THUMB_SIZE / 2 : 0;
  const rangeEnd = last + THUMB_SIZE / 2;
  return (
    <View
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={values[0]}
      aria-disabled={disabled}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event) => {
        const delta =
          event.nativeEvent.actionName === "increment" ? step : -step;
        update(0, (values[0] ?? min) + delta);
      }}
      onLayout={onLayout}
      className={cn(
        "h-8 w-full justify-center",
        disabled && "opacity-50",
        className,
      )}
      {...panResponder.panHandlers}
      {...props}
    >
      <View
        pointerEvents="none"
        className="h-3 w-full overflow-hidden rounded border-2 border-border bg-background"
      >
        <View
          className={cn("absolute inset-y-0 bg-primary", rangeClassName)}
          style={{
            left: rangeStart,
            width: Math.max(rangeEnd - rangeStart, 0),
          }}
        />
      </View>
      {values.map((v, index) => (
        <View
          key={index}
          pointerEvents="none"
          className="absolute"
          style={{ left: positionOf(v), width: THUMB_SIZE, height: THUMB_SIZE }}
        >
          <ShadowBox
            size="md"
            contentClassName={cn(
              "rounded border-2 border-border bg-background",
              thumbClassName,
            )}
            style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          />
        </View>
      ))}
    </View>
  );
}

export { Slider };
export type { SliderProps };

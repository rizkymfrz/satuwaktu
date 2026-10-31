import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BackHandler,
  PanResponder,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tape } from "@/components/scrapbook/tape";
import { TornEdge } from "@/components/scrapbook/torn-edge";
import { usePaper } from "@/components/scrapbook/use-paper";
import { KeyboardInsetView } from "@/lib/keyboard-reveal";
import { Space } from "@/theme/space";

const CLOSE_MS = 200;
const FLING_PROJECTION = 200;
const SPRING = { damping: 24, stiffness: 220, mass: 0.8 };

function SnapDrawer({
  open,
  onClose,
  snapPoints = [0.5, 1],
  header,
  scroll = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  snapPoints?: number[];
  header?: ReactNode;
  scroll?: boolean;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const paper = usePaper();
  const [size, setSize] = useState(0);
  const [mounted, setMounted] = useState(open);
  const height = useSharedValue(0);
  const startHeight = useSharedValue(0);
  if (open && !mounted) {
    setMounted(true);
  }
  const snaps = useMemo(
    () => snapPoints.map((point) => Math.round(size * point)),
    [size, snapPoints],
  );
  useEffect(() => {
    if (size === 0) {
      return;
    }
    if (open) {
      height.set(withSpring(snaps[0], SPRING));
      return;
    }
    height.set(withTiming(0, { duration: CLOSE_MS }));
    const timer = setTimeout(() => setMounted(false), CLOSE_MS);
    return () => clearTimeout(timer);
  }, [open, size, snaps, height]);
  useEffect(() => {
    if (!open) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );
    return () => subscription.remove();
  }, [open, onClose]);
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startHeight.set(height.get());
        },
        onPanResponderMove: (_, gesture) => {
          const next = startHeight.get() - gesture.dy;
          height.set(Math.max(0, Math.min(size, next)));
        },
        onPanResponderRelease: (_, gesture) => {
          const projected = height.get() - gesture.vy * FLING_PROJECTION;
          const targets = [0, ...snaps];
          const target = targets.reduce((best, candidate) =>
            Math.abs(candidate - projected) < Math.abs(best - projected)
              ? candidate
              : best,
          );
          if (target === 0) {
            onClose();
            return;
          }
          height.set(withSpring(target, SPRING));
        },
      }),
    [height, startHeight, size, snaps, onClose],
  );
  const sheetStyle = useAnimatedStyle(() => ({ height: height.get() }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      height.get(),
      [0, snaps[0] ?? 1],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));
  const headerStyle = useAnimatedStyle(() => ({
    paddingTop: interpolate(
      height.get(),
      [size * 0.9, size],
      [0, insets.top],
      Extrapolation.CLAMP,
    ),
  }));
  return (
    <View
      className="absolute inset-0 z-50"
      pointerEvents={mounted ? "auto" : "none"}
      onLayout={(event) => setSize(event.nativeEvent.layout.height)}
    >
      {mounted ? (
        <>
          <Animated.View
            className="absolute inset-0 bg-foreground/30"
            style={backdropStyle}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tutup"
              className="flex-1"
              onPress={onClose}
            />
          </Animated.View>
          <Animated.View
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            style={sheetStyle}
          >
            <TornEdge />
            <View className="flex-1" style={{ backgroundColor: paper.kraft }}>
              <Animated.View {...pan.panHandlers} style={headerStyle}>
                <Tape
                  seed="drawer-handle"
                  width={72}
                  height={20}
                  tilt={-2}
                  className="mt-2 self-center"
                />
                {header}
              </Animated.View>
              <KeyboardInsetView className="flex-1">
                {scroll ? (
                  <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                      paddingBottom: insets.bottom + Space.lg,
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    {children}
                  </ScrollView>
                ) : (
                  <View className="flex-1">{children}</View>
                )}
              </KeyboardInsetView>
            </View>
          </Animated.View>
        </>
      ) : null}
    </View>
  );
}

export { SnapDrawer };

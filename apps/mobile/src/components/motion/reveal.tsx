import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type Ref,
} from "react";
import {
  useWindowDimensions,
  View,
  type ScrollViewInstance,
  type ScrollViewProps,
} from "react-native";
import Animated, {
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const RevealContext = createContext<SharedValue<number> | null>(null);
const EDGE = 48;
const SPRING = { damping: 15, stiffness: 110, mass: 0.9 };
const NEAR_END_INTERVAL = 100;

function useRevealScroll(onNearEnd?: () => void, nearEndThreshold = 600) {
  const scrollY = useSharedValue(0);
  const lastFired = useSharedValue(0);
  const nearEndRef = useRef(onNearEnd);
  useEffect(() => {
    nearEndRef.current = onNearEnd;
  }, [onNearEnd]);
  const fireNearEnd = useCallback(() => nearEndRef.current?.(), []);
  const listens = onNearEnd !== undefined;
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
    if (!listens) {
      return;
    }
    const remaining =
      event.contentSize.height -
      (event.contentOffset.y + event.layoutMeasurement.height);
    const now = Date.now();
    if (
      remaining < nearEndThreshold &&
      now - lastFired.get() > NEAR_END_INTERVAL
    ) {
      lastFired.set(now);
      scheduleOnRN(fireNearEnd);
    }
  });
  return { scrollY, onScroll };
}

type RevealScrollViewProps = Omit<ScrollViewProps, "onScroll"> & {
  onNearEnd?: () => void;
  ref?: Ref<ScrollViewInstance>;
};

function RevealScrollView({ onNearEnd, ref, ...props }: RevealScrollViewProps) {
  const { scrollY, onScroll } = useRevealScroll(onNearEnd);
  return (
    <RevealContext.Provider value={scrollY}>
      <Animated.ScrollView
        ref={ref}
        onScroll={onScroll}
        scrollEventThrottle={16}
        {...props}
      />
    </RevealContext.Provider>
  );
}

function useReveal(delay = 0) {
  const scrollY = useRevealContext();
  const { height } = useWindowDimensions();
  const reduced = useReducedMotion();
  const fallback = useSharedValue(0);
  const scroll = scrollY ?? fallback;
  const tracked = scrollY !== null;
  const ref = useAnimatedRef<View>();
  const layouts = useSharedValue(0);
  const progress = useSharedValue(reduced ? 1 : 0);
  const onLayout = useCallback(() => {
    layouts.set(layouts.get() + 1);
  }, [layouts]);
  useAnimatedReaction(
    () => {
      scroll.get();
      if (!tracked) {
        return true;
      }
      if (progress.get() >= 1 || layouts.get() === 0) {
        return false;
      }
      const measured = measure(ref);
      return measured !== null && measured.pageY < height - EDGE;
    },
    (visible, previous) => {
      if (visible && !previous && progress.get() < 1) {
        progress.set(withDelay(delay, withSpring(1, SPRING)));
      }
    },
    [height, delay, tracked],
  );
  return { ref, onLayout, progress };
}

function useRevealContext() {
  return useContext(RevealContext);
}

export { RevealContext, RevealScrollView, useReveal, useRevealScroll };

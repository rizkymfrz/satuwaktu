import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  TextInput,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Space } from "@/theme/space";

const REVEAL_MARGIN = Space.xxl;
const SETTLE_MS = 16;
const KEYBOARD_MS = 250;

const SHOW_EVENT =
  Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";

const HIDE_EVENT =
  Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

const GUESS_KEYBOARD_RATIO = 0.4;
const KeyboardRevealContext = createContext<(() => void) | null>(null);

function useKeyboardInset() {
  const inset = useSharedValue(0);
  useEffect(() => {
    const animate = (height: number, duration: number) => {
      inset.set(
        withTiming(height, {
          duration: duration > 0 ? duration : KEYBOARD_MS,
          easing: Easing.out(Easing.cubic),
          reduceMotion: ReduceMotion.System,
        }),
      );
    };
    const show = Keyboard.addListener(SHOW_EVENT, (event) =>
      animate(event.endCoordinates.height, event.duration),
    );
    const hide = Keyboard.addListener(HIDE_EVENT, (event) =>
      animate(0, event.duration),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, [inset]);
  return inset;
}

function KeyboardInsetView({
  style,
  ...props
}: ComponentProps<typeof Animated.View>) {
  const inset = useKeyboardInset();
  const animated = useAnimatedStyle(() => ({ paddingBottom: inset.get() }));
  return <Animated.View style={[style, animated]} {...props} />;
}

function useKeyboardReveal() {
  const ref = useRef<ScrollViewInstance>(null);
  const offset = useRef(0);
  const contentHeight = useRef(0);
  const viewportHeight = useRef(0);
  const padding = useRef(0);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyboardTop = useRef<number | null>(null);
  const lastHeight = useRef(
    Dimensions.get("window").height * GUESS_KEYBOARD_RATIO,
  );
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const applyPadding = useCallback((height: number) => {
    padding.current = height;
    setKeyboardHeight(height);
  }, []);
  const cancelRelease = useCallback(() => {
    if (releaseTimer.current !== null) {
      clearTimeout(releaseTimer.current);
      releaseTimer.current = null;
    }
  }, []);
  const reveal = useCallback(() => {
    cancelRelease();
    if (keyboardTop.current === null) {
      applyPadding(lastHeight.current);
    }
    setTimeout(() => {
      const top =
        keyboardTop.current ??
        Dimensions.get("window").height - lastHeight.current;
      const input = TextInput.State.currentlyFocusedInput();
      const scroll = ref.current;
      if (!input || !scroll) {
        return;
      }
      input.measureInWindow((_x, y, _width, height) => {
        const overlap = y + height + REVEAL_MARGIN - top;
        if (overlap <= 0) {
          return;
        }
        offset.current += overlap;
        scroll.scrollTo({ y: offset.current, animated: true });
      });
    }, SETTLE_MS);
  }, [applyPadding, cancelRelease]);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (event) => {
      cancelRelease();
      keyboardTop.current = event.endCoordinates.screenY;
      lastHeight.current = event.endCoordinates.height;
      applyPadding(event.endCoordinates.height);
      reveal();
    });
    const hide = Keyboard.addListener(HIDE_EVENT, (event) => {
      keyboardTop.current = null;
      const target = Math.max(
        0,
        Math.min(
          offset.current,
          contentHeight.current - padding.current - viewportHeight.current,
        ),
      );
      if (ref.current && target < offset.current) {
        offset.current = target;
        ref.current.scrollTo({ y: target, animated: true });
      }
      cancelRelease();
      releaseTimer.current = setTimeout(
        () => applyPadding(0),
        event.duration > 0 ? event.duration : KEYBOARD_MS,
      );
    });
    return () => {
      show.remove();
      hide.remove();
      cancelRelease();
    };
  }, [reveal, applyPadding, cancelRelease]);
  const track = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    offset.current = event.nativeEvent.contentOffset.y;
  };
  return {
    ref,
    reveal,
    bottomInset: keyboardHeight,
    scrollProps: {
      onScrollEndDrag: track,
      onMomentumScrollEnd: track,
      onContentSizeChange: (_width: number, height: number) => {
        contentHeight.current = height;
      },
      onLayout: (event: LayoutChangeEvent) => {
        viewportHeight.current = event.nativeEvent.layout.height;
      },
    },
  };
}

function useRevealOnFocus() {
  return useContext(KeyboardRevealContext);
}

export {
  KeyboardInsetView,
  KeyboardRevealContext,
  useKeyboardReveal,
  useRevealOnFocus,
};

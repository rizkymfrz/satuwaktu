import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { Modal, useWindowDimensions, View } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Space } from "@/theme/space";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(max, Math.max(min, value));
}

function ZoomableImage({ uri, aspect }: { uri: string; aspect: number }) {
  const { width, height } = useWindowDimensions();
  const fitWidth = Math.min(width, height / aspect);
  const fitHeight = fitWidth * aspect;
  const scale = useSharedValue(MIN_SCALE);
  const savedScale = useSharedValue(MIN_SCALE);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);
  const reset = () => {
    "worklet";
    scale.set(MIN_SCALE);
    savedScale.set(MIN_SCALE);
    x.set(0);
    y.set(0);
    savedX.set(0);
    savedY.set(0);
  };
  const pinch = usePinchGesture({
    onUpdate: (event) => {
      "worklet";
      scale.set(clamp(savedScale.get() * event.scale, MIN_SCALE, MAX_SCALE));
    },
    onDeactivate: () => {
      "worklet";
      if (scale.get() <= MIN_SCALE) {
        reset();
        return;
      }
      savedScale.set(scale.get());
    },
  });
  const pan = usePanGesture({
    onUpdate: (event) => {
      "worklet";
      const maxX = Math.max(0, (fitWidth * scale.get() - width) / 2);
      const maxY = Math.max(0, (fitHeight * scale.get() - height) / 2);
      x.set(clamp(savedX.get() + event.translationX, -maxX, maxX));
      y.set(clamp(savedY.get() + event.translationY, -maxY, maxY));
    },
    onDeactivate: () => {
      "worklet";
      savedX.set(x.get());
      savedY.set(y.get());
    },
  });
  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    onDeactivate: (event) => {
      "worklet";
      if (event.canceled) {
        return;
      }
      if (scale.get() > MIN_SCALE) {
        reset();
        return;
      }
      scale.set(DOUBLE_TAP_SCALE);
      savedScale.set(DOUBLE_TAP_SCALE);
    },
  });
  const gesture = useSimultaneousGestures(pinch, pan, doubleTap);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() },
      { translateY: y.get() },
      { scale: scale.get() },
    ],
  }));
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className="flex-1 items-center justify-center"
        style={style}
      >
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width, height }}
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
    </GestureDetector>
  );
}

function PhotoViewer({
  uri,
  aspect,
  open,
  onClose,
}: {
  uri: string;
  aspect: number;
  open: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView className="flex-1 bg-foreground/95">
        <ZoomableImage uri={uri} aspect={aspect} />
        <View
          className="absolute right-4"
          style={{ top: insets.top + Space.lg }}
        >
          <Button
            variant="secondary"
            size="icon"
            accessibilityLabel="Tutup foto"
            onPress={onClose}
          >
            <Icon as={X} size={18} />
          </Button>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

export { PhotoViewer };

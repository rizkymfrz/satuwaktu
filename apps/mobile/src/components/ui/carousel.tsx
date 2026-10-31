import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react-native";
import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ScrollView,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  type ViewProps,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { cn } from "@/lib/utils";

type CarouselOrientation = "horizontal" | "vertical";

type CarouselApi = {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
};

type CarouselProps = ViewProps & {
  orientation?: CarouselOrientation;
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  orientation: CarouselOrientation;
  size: number;
  index: number;
  count: number;
  scrollRef: RefObject<ScrollViewInstance | null>;
  setSize: (size: number) => void;
  setCount: (count: number) => void;
  setIndex: (index: number) => void;
  scrollTo: (index: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const NAV_GUTTER = 44;
const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

function Carousel({
  orientation = "horizontal",
  setApi,
  className,
  style,
  children,
  ...props
}: CarouselProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [size, setSize] = useState(0);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const isHorizontal = orientation === "horizontal";
  const scrollTo = useCallback(
    (target: number) => {
      const next = Math.max(0, Math.min(target, count - 1));
      scrollRef.current?.scrollTo({
        x: isHorizontal ? next * size : 0,
        y: isHorizontal ? 0 : next * size,
        animated: true,
      });
      setIndex(next);
    },
    [count, size, isHorizontal],
  );
  const scrollPrev = useCallback(() => scrollTo(index - 1), [scrollTo, index]);
  const scrollNext = useCallback(() => scrollTo(index + 1), [scrollTo, index]);
  const canScrollPrev = index > 0;
  const canScrollNext = index < count - 1;
  const api = useMemo<CarouselApi>(
    () => ({
      scrollPrev,
      scrollNext,
      scrollTo,
      selectedScrollSnap: () => index,
      scrollSnapList: () => Array.from({ length: count }, (_, i) => i * size),
      canScrollPrev: () => canScrollPrev,
      canScrollNext: () => canScrollNext,
    }),
    [
      scrollPrev,
      scrollNext,
      scrollTo,
      index,
      count,
      size,
      canScrollPrev,
      canScrollNext,
    ],
  );
  useEffect(() => {
    setApi?.(api);
  }, [api, setApi]);
  return (
    <CarouselContext.Provider
      value={{
        orientation,
        size,
        index,
        count,
        scrollRef,
        setSize,
        setCount,
        setIndex,
        scrollTo,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <View
        role="group"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        style={[
          isHorizontal
            ? { paddingHorizontal: NAV_GUTTER }
            : { paddingVertical: NAV_GUTTER },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { orientation, size, scrollRef, setSize, setCount, setIndex } =
    useCarousel();
  const isHorizontal = orientation === "horizontal";
  const count = Children.count(children);
  useEffect(() => {
    setCount(count);
  }, [count, setCount]);
  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (size === 0) {
      return;
    }
    const { contentOffset } = event.nativeEvent;
    const offset = isHorizontal ? contentOffset.x : contentOffset.y;
    setIndex(Math.round(offset / size));
  }
  function handleLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setSize(isHorizontal ? width : height);
  }
  return (
    <ShadowBox
      size="md"
      contentClassName="aspect-square overflow-hidden rounded-md border-2 border-border bg-card"
    >
      <View style={{ flex: 1, overflow: "hidden" }}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          onLayout={handleLayout}
          horizontal={isHorizontal}
          snapToInterval={size > 0 ? size : undefined}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          directionalLockEnabled
          nestedScrollEnabled
          bounces={false}
          overScrollMode="never"
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumEnd}
          contentContainerClassName={className}
        >
          {size > 0 ? children : null}
        </ScrollView>
      </View>
    </ShadowBox>
  );
}

function CarouselItem({
  className,
  style,
  ...props
}: ComponentProps<typeof View>) {
  const { orientation, size } = useCarousel();
  const isHorizontal = orientation === "horizontal";
  return (
    <View
      role="group"
      aria-roledescription="slide"
      className={cn("shrink-0 grow-0", className)}
      style={[
        size > 0 ? (isHorizontal ? { width: size } : { height: size }) : null,
        style,
      ]}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  const isHorizontal = orientation === "horizontal";
  return (
    <View
      pointerEvents="box-none"
      style={
        isHorizontal
          ? {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              justifyContent: "center",
            }
          : {
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              alignItems: "center",
            }
      }
    >
      <Button
        variant={variant}
        size={size}
        className={cn("size-8 rounded", className)}
        aria-label="Previous slide"
        disabled={!canScrollPrev}
        onPress={scrollPrev}
        {...props}
      >
        <Icon as={isHorizontal ? ArrowLeft : ArrowUp} size={16} />
      </Button>
    </View>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  const isHorizontal = orientation === "horizontal";
  return (
    <View
      pointerEvents="box-none"
      style={
        isHorizontal
          ? {
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              justifyContent: "center",
            }
          : {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
            }
      }
    >
      <Button
        variant={variant}
        size={size}
        className={cn("size-8 rounded", className)}
        aria-label="Next slide"
        disabled={!canScrollNext}
        onPress={scrollNext}
        {...props}
      >
        <Icon as={isHorizontal ? ArrowRight : ArrowDown} size={16} />
      </Button>
    </View>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
};

export type { CarouselApi };

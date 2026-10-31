import { Heart } from "lucide-react-native";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TypographyH4, TypographySmall } from "@/components/ui/typography";
import type { Fragment } from "@/features/archive/types";
import { AccountName } from "@/features/session/components/account-name";
import { cn } from "@/lib/utils";

const POP_SCALE = 1.4;
const POP_IN_MS = 120;

function UploaderRow({
  fragment,
  liked,
  onToggleLike,
}: {
  fragment: Fragment;
  liked: boolean;
  onToggleLike: () => void;
}) {
  const pop = useSharedValue(1);
  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.get() }],
  }));
  const press = () => {
    if (!liked) {
      pop.set(
        withSequence(
          withTiming(POP_SCALE, { duration: POP_IN_MS }),
          withSpring(1),
        ),
      );
    }
    onToggleLike();
  };
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-4">
        <Avatar alt={fragment.uploader.name} size="lg">
          <AvatarFallback>
            <TypographySmall className="text-base">
              {fragment.uploader.name.charAt(0).toUpperCase()}
            </TypographySmall>
          </AvatarFallback>
        </Avatar>
        <AccountName
          account={fragment.uploader}
          className="font-medium"
          iconSize={14}
        />
      </View>
      <View className="flex-row items-center gap-4">
        <TypographyH4 className="font-head">{fragment.likes}</TypographyH4>
        <View className="size-12">
          <Button
            circle
            size="icon-lg"
            variant={liked ? "default" : "outline"}
            shadowSize="md"
            className={cn("size-12 rounded-full", !liked && "bg-background")}
            accessibilityLabel={`Like, ${fragment.likes}`}
            accessibilityState={{ selected: liked }}
            onPress={press}
          >
            <Animated.View style={popStyle}>
              <Icon as={Heart} size={20} />
            </Animated.View>
          </Button>
        </View>
      </View>
    </View>
  );
}

export { UploaderRow };

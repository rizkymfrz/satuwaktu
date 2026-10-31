import { Calendar as CalendarIcon } from "lucide-react-native";
import { View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
} from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TimeField } from "@/features/fragments/components/form/time-field";
import { formatLongDate } from "@/lib/format";

function TakenAtSection({
  takenAt,
  calendarOpen,
  onToggle,
  onSelect,
  onTimeChange,
}: {
  takenAt: Date;
  calendarOpen: boolean;
  onToggle: () => void;
  onSelect: (day: Date | undefined) => void;
  onTimeChange: (hours: number, minutes: number) => void;
}) {
  return (
    <View className="gap-4">
      <Button
        shadowSize="md"
        variant="secondary"
        className="w-full justify-start"
        accessibilityLabel="Pilih tanggal foto diambil"
        onPress={onToggle}
      >
        <Icon as={CalendarIcon} size={16} />
        <Text>{formatLongDate(takenAt.toISOString())}</Text>
      </Button>
      <View className="flex-row items-center gap-4">
        <TimeField
          label="Jam"
          value={takenAt.getHours()}
          max={23}
          onCommit={(hours) => onTimeChange(hours, takenAt.getMinutes())}
        />
        <Text className="font-head text-2xl">:</Text>
        <TimeField
          label="Menit"
          value={takenAt.getMinutes()}
          max={59}
          onCommit={(minutes) => onTimeChange(takenAt.getHours(), minutes)}
        />
      </View>
      {calendarOpen ? (
        <Animated.View
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
        >
          <Calendar
            mode="single"
            selected={takenAt}
            onSelect={onSelect}
            disabled={(day) => day > new Date()}
            locale="id-ID"
            fullWidth
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

export { TakenAtSection };

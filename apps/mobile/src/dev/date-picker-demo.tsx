import { Calendar as CalendarIcon } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

function DatePickerBasic() {
  const [date, setDate] = useState<Date>();
  return (
    <View className="flex-row">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <Icon as={CalendarIcon} size={16} />
            <Text
              className={cn("font-normal", !date && "text-muted-foreground")}
            >
              {date ? dateFormatter.format(date) : "Pick a date"}
            </Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            shadow={false}
            className="border-0 bg-transparent"
          />
        </PopoverContent>
      </Popover>
    </View>
  );
}

function DatePickerRange() {
  const [range, setRange] = useState<DateRange>();
  return (
    <View className="flex-row">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <Icon as={CalendarIcon} size={16} />
            <Text
              className={cn(
                "font-normal",
                !range?.from && "text-muted-foreground",
              )}
            >
              {range?.from
                ? range.to
                  ? `${shortDateFormatter.format(range.from)} - ${shortDateFormatter.format(range.to)}`
                  : shortDateFormatter.format(range.from)
                : "Pick a date range"}
            </Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            shadow={false}
            className="border-0 bg-transparent"
          />
        </PopoverContent>
      </Popover>
    </View>
  );
}

function DatePickerInput() {
  const [date, setDate] = useState<Date>();
  const [text, setText] = useState("");
  function changeText(value: string) {
    setText(value);
    const parsed = new Date(value);
    setDate(Number.isNaN(parsed.getTime()) ? undefined : parsed);
  }
  function selectDate(next: Date | undefined) {
    setDate(next);
    setText(next ? dateFormatter.format(next) : "");
  }
  return (
    <View className="flex-row items-start gap-2">
      <View className="mr-1 min-w-0 flex-1">
        <Input
          placeholder="June 01, 2025"
          value={text}
          onChangeText={changeText}
        />
      </View>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10"
            aria-label="Select date"
          >
            <Icon as={CalendarIcon} size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={selectDate}
            defaultMonth={date}
            shadow={false}
            className="border-0 bg-transparent"
          />
        </PopoverContent>
      </Popover>
    </View>
  );
}

export { DatePickerBasic, DatePickerInput, DatePickerRange };

import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useMemo, useState, type ComponentProps } from "react";
import { Platform, Pressable, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type DateRange = {
  from?: Date;
  to?: Date;
};

type CalendarBaseProps = {
  className?: string;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  disabled?: (date: Date) => boolean;
  locale?: string;
  buttonVariant?: ComponentProps<typeof Button>["variant"];
  shadow?: boolean;
  fullWidth?: boolean;
};

type CalendarProps = CalendarBaseProps &
  (
    | {
        mode?: undefined;
        selected?: undefined;
        onSelect?: undefined;
      }
    | {
        mode: "single";
        selected?: Date;
        onSelect?: (date: Date | undefined) => void;
      }
    | {
        mode: "range";
        selected?: DateRange;
        onSelect?: (range: DateRange | undefined) => void;
      }
  );

const DAYS_IN_WEEK = 7;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isSameDay(a?: Date, b?: Date) {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function getWeeks(month: Date, weekStartsOn: number, fixedWeeks: boolean) {
  const first = startOfMonth(month);
  const offset = (first.getDay() - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const weekCount = fixedWeeks
    ? 6
    : Math.ceil((offset + daysInMonth) / DAYS_IN_WEEK);
  const gridStart = addDays(first, -offset);
  return Array.from({ length: weekCount }, (_, week) =>
    Array.from({ length: DAYS_IN_WEEK }, (_, day) =>
      addDays(gridStart, week * DAYS_IN_WEEK + day),
    ),
  );
}

function Calendar({
  className,
  month,
  defaultMonth,
  onMonthChange,
  showOutsideDays = true,
  fixedWeeks = true,
  weekStartsOn = 0,
  disabled,
  locale,
  buttonVariant = "outline",
  shadow = true,
  fullWidth = false,
  ...props
}: CalendarProps) {
  const cellClass = fullWidth ? "h-10 flex-1" : "size-10";
  const selectedAnchor =
    props.mode === "single"
      ? props.selected
      : props.mode === "range"
        ? props.selected?.from
        : undefined;
  const [internalMonth, setInternalMonth] = useState(() =>
    startOfMonth(defaultMonth ?? selectedAnchor ?? new Date()),
  );
  const visibleMonth = month ? startOfMonth(month) : internalMonth;
  const today = startOfDay(new Date());
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale],
  );
  const dayLabelFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locale],
  );
  const weekdays = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const sunday = new Date(2023, 0, 1);
    return Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
      formatter
        .format(addDays(sunday, (weekStartsOn + index) % DAYS_IN_WEEK))
        .slice(0, 2),
    );
  }, [locale, weekStartsOn]);
  const weeks = useMemo(
    () => getWeeks(visibleMonth, weekStartsOn, fixedWeeks),
    [visibleMonth, weekStartsOn, fixedWeeks],
  );
  function goToMonth(amount: number) {
    const next = addMonths(visibleMonth, amount);
    if (!month) {
      setInternalMonth(next);
    }
    onMonthChange?.(next);
  }
  function handleSelect(date: Date) {
    if (props.mode === "single") {
      props.onSelect?.(isSameDay(props.selected, date) ? undefined : date);
      return;
    }
    if (props.mode === "range") {
      const { from, to } = props.selected ?? {};
      if (!from || to) {
        props.onSelect?.({ from: date, to: undefined });
        return;
      }
      props.onSelect?.(
        date < from ? { from: date, to: from } : { from, to: date },
      );
    }
  }
  return (
    <View style={{ flexDirection: "row" }}>
      <ShadowBox
        size="md"
        role="grid"
        className={cn(!shadow && "shadow-none", fullWidth && "flex-1")}
        shadowClassName={cn(!shadow && "hidden")}
        contentClassName={cn(
          "rounded-md border-2 border-border bg-card p-2",
          className,
        )}
      >
        <View className="h-10 flex-row items-center justify-between">
          <Button
            variant={buttonVariant}
            size="icon-sm"
            className="rounded"
            aria-label="Previous month"
            onPress={() => goToMonth(-1)}
          >
            <Icon as={ChevronLeft} size={16} />
          </Button>
          <Text className="font-head text-sm font-medium">
            {monthFormatter.format(visibleMonth)}
          </Text>
          <Button
            variant={buttonVariant}
            size="icon-sm"
            className="rounded"
            aria-label="Next month"
            onPress={() => goToMonth(1)}
          >
            <Icon as={ChevronRight} size={16} />
          </Button>
        </View>
        <View className="mt-2 flex-row">
          {weekdays.map((weekday, index) => (
            <View
              key={index}
              className={cn(cellClass, "items-center justify-center")}
            >
              <Text className="text-[0.8rem] font-normal text-muted-foreground">
                {weekday}
              </Text>
            </View>
          ))}
        </View>
        {weeks.map((week) => (
          <View
            key={week[0].toISOString()}
            role="row"
            className="mt-2 flex-row"
          >
            {week.map((date) => {
              const outside = !isSameMonth(date, visibleMonth);
              if (outside && !showOutsideDays) {
                return <View key={date.toISOString()} className={cellClass} />;
              }
              const range = props.mode === "range" ? props.selected : undefined;
              const isRangeStart = isSameDay(range?.from, date);
              const isRangeEnd = isSameDay(range?.to, date);
              const isRangeMiddle =
                !!range?.from &&
                !!range.to &&
                date > range.from &&
                date < range.to;
              const isSelectedSingle =
                props.mode === "single" && isSameDay(props.selected, date);
              const isSelected = isSelectedSingle || isRangeStart || isRangeEnd;
              const hasRange =
                !!range?.from && !!range.to && !isSameDay(range.from, range.to);
              const isToday = isSameDay(date, today);
              const isDisabled = disabled?.(date) ?? false;
              return (
                <View
                  key={date.toISOString()}
                  className={cn(
                    cellClass,
                    "items-center justify-center",
                    isRangeMiddle && "bg-primary/30",
                    hasRange && isRangeStart && "rounded-l-md bg-primary/30",
                    hasRange && isRangeEnd && "rounded-r-md bg-primary/30",
                    outside && "opacity-60",
                  )}
                >
                  <Pressable
                    role="button"
                    aria-label={dayLabelFormatter.format(date)}
                    aria-selected={isSelected}
                    disabled={isDisabled || props.mode === undefined}
                    onPress={() => handleSelect(date)}
                    className={cn(
                      "size-10 items-center justify-center",
                      Platform.select({
                        web: "cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      }),
                      "rounded-md border-2 border-transparent",
                      isSelected
                        ? "border-border bg-primary"
                        : cn(
                            "active:bg-accent",
                            Platform.select({
                              web: "transition-colors hover:bg-accent",
                            }),
                            isToday && "border-primary",
                            isRangeMiddle && "rounded-none",
                          ),
                      isDisabled && "opacity-50",
                    )}
                  >
                    <Text
                      className={cn(
                        "font-head text-sm font-normal",
                        outside && "text-muted-foreground",
                        isSelected && "text-primary-foreground",
                      )}
                    >
                      {date.getDate()}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}
      </ShadowBox>
    </View>
  );
}

export { Calendar };
export type { CalendarProps, DateRange };

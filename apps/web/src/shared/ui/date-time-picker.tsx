"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/shared/ui/calendar";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface DateTimePickerProps {
  value: string;
  onChange: (iso: string) => void;
}

function toDate(value: string): Date {
  const d = new Date(value);
  return isValid(d) ? d : new Date();
}

function toTimeString(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const current = toDate(value);
  const [time, setTime] = React.useState(toTimeString(current));

  const emit = (date: Date, t: string) => {
    const [h, m] = t.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(h ?? 0, m ?? 0, 0, 0);
    onChange(combined.toISOString());
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    emit(date, time);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    emit(current, e.target.value);
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 space-y-1">
        <Label>Tanggal</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none flex items-center justify-between md:text-sm dark:bg-input/30"
            >
              {format(current, "d MMMM yyyy", { locale: id })}
              <ChevronDownIcon className="size-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={current}
              captionLayout="dropdown"
              defaultMonth={current}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-28 space-y-1">
        <Label>Waktu</Label>
        <Input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </div>
    </div>
  );
}

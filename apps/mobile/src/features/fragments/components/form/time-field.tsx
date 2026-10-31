import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

function TimeField({
  label,
  value,
  max,
  onCommit,
}: {
  label: string;
  value: number;
  max: number;
  onCommit: (value: number) => void;
}) {
  const [version, setVersion] = useState(0);
  const commit = (text: string) => {
    const parsed = Number.parseInt(text, 10);
    if (Number.isFinite(parsed)) {
      onCommit(Math.min(max, Math.max(0, parsed)));
    }
    setVersion((current) => current + 1);
  };
  const unit = label.toLowerCase();
  return (
    <View className="flex-1 gap-4">
      <Button
        variant="secondary"
        size="icon-sm"
        accessibilityLabel={`Tambah ${unit}`}
        onPress={() => onCommit((value + 1) % (max + 1))}
      >
        <Icon as={ChevronUp} size={16} />
      </Button>
      <Input
        key={`${version}-${value}`}
        className="h-12"
        inputClassName="text-center font-head text-xl leading-6"
        defaultValue={String(value).padStart(2, "0")}
        keyboardType="number-pad"
        maxLength={2}
        selectTextOnFocus
        accessibilityLabel={label}
        onEndEditing={(event) => commit(event.nativeEvent.text)}
      />
      <Button
        variant="secondary"
        size="icon-sm"
        accessibilityLabel={`Kurangi ${unit}`}
        onPress={() => onCommit((value + max) % (max + 1))}
      >
        <Icon as={ChevronDown} size={16} />
      </Button>
    </View>
  );
}

export { TimeField };

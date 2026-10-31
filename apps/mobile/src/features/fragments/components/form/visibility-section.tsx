import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Toggle } from "@/components/ui/toggle";
import type { Visibility } from "@/features/archive/types";
import { FormSection } from "@/features/fragments/components/form/form-section";

const VISIBILITY_HINT: Record<Visibility, string> = {
  PUBLIC: "Terbuka bagi siapa pun yang singgah ke arsip ini.",
  PRIVATE: "Hanya kamu, sang pemilik, yang bisa melihatnya.",
};

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <View className="flex-1">
      <Toggle size="sm" circle pressed={selected} onPressedChange={onPress}>
        <Text>{label}</Text>
      </Toggle>
    </View>
  );
}

function VisibilitySection({
  visibility,
  onChange,
}: {
  visibility: Visibility;
  onChange: (value: Visibility) => void;
}) {
  return (
    <FormSection title="Visibilitas" hint={VISIBILITY_HINT[visibility]}>
      <View className="flex-row gap-4">
        <Chip
          label="Terbuka"
          selected={visibility === "PUBLIC"}
          onPress={() => onChange("PUBLIC")}
        />
        <Chip
          label="Pribadi"
          selected={visibility === "PRIVATE"}
          onPress={() => onChange("PRIVATE")}
        />
      </View>
    </FormSection>
  );
}

export { VisibilitySection };

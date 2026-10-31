import { Smartphone, Type } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SettingsGroup } from "@/features/settings/components/settings-group";
import {
  SettingsRow,
  SOON_LABEL,
} from "@/features/settings/components/settings-row";
import { useSettings, type TextSize } from "@/features/settings/store";

function AppearanceGroup() {
  const { settings, update } = useSettings();
  return (
    <SettingsGroup title="Tampilan">
      <SettingsRow icon={Type} title="Ukuran teks" description={SOON_LABEL}>
        <View className="-mb-1 -mr-1">
          <ToggleGroup
            type="single"
            spacing={0}
            disabled
            value={settings.textSize}
            onValueChange={(value) =>
              value && update("textSize", value as TextSize)
            }
          >
            <ToggleGroupItem value="SMALL" aria-label="Kecil">
              <Text>A-</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="NORMAL" aria-label="Normal">
              <Text>A</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="LARGE" aria-label="Besar">
              <Text>A+</Text>
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
      </SettingsRow>
      <SettingsRow
        icon={Smartphone}
        title="Bahasa"
        description="Bahasa Indonesia"
      />
    </SettingsGroup>
  );
}

export { AppearanceGroup };

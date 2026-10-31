import { Eye } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Visibility } from "@/features/archive/types";
import { SettingsGroup } from "@/features/settings/components/settings-group";
import { SettingsRow } from "@/features/settings/components/settings-row";
import { useSettings } from "@/features/settings/store";

function PrivacyGroup() {
  const { settings, update } = useSettings();
  return (
    <SettingsGroup title="Privasi">
      <SettingsRow
        icon={Eye}
        title="Visibilitas awal"
        description="Untuk fragmen baru"
      >
        <View className="-mb-1 -mr-1">
          <ToggleGroup
            type="single"
            spacing={0}
            value={settings.defaultVisibility}
            onValueChange={(value) =>
              value && update("defaultVisibility", value as Visibility)
            }
          >
            <ToggleGroupItem value="PUBLIC" aria-label="Terbuka">
              <Text>Terbuka</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="PRIVATE" aria-label="Pribadi">
              <Text>Pribadi</Text>
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
      </SettingsRow>
    </SettingsGroup>
  );
}

export { PrivacyGroup };

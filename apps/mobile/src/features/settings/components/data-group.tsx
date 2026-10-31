import { Image } from "expo-image";
import { Download, Eraser, Gauge } from "lucide-react-native";
import { toast } from "@/components/ui/sonner";
import { SettingsGroup } from "@/features/settings/components/settings-group";
import {
  SettingsRow,
  SettingsSwitchRow,
} from "@/features/settings/components/settings-row";
import { useSettings } from "@/features/settings/store";

async function clearImageCache() {
  try {
    await Promise.all([Image.clearMemoryCache(), Image.clearDiskCache()]);
    toast.success("Data sementara dibersihkan");
  } catch {
    toast.error("Gagal membersihkan data sementara.");
  }
}

function DataGroup() {
  const { settings, update } = useSettings();
  return (
    <SettingsGroup title="Data">
      <SettingsSwitchRow
        icon={Download}
        title="Simpan foto otomatis"
        soon
        checked={settings.autoSavePhotos}
        onChange={(value) => update("autoSavePhotos", value)}
      />
      <SettingsSwitchRow
        icon={Gauge}
        title="Hemat kuota"
        soon
        checked={settings.dataSaver}
        onChange={(value) => update("dataSaver", value)}
      />
      <SettingsRow
        icon={Eraser}
        title="Bersihkan data sementara"
        description="Hapus foto sementara di perangkat"
        onPress={clearImageCache}
      />
    </SettingsGroup>
  );
}

export { DataGroup };

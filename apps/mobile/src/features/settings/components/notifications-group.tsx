import { Heart, History, MessageSquare } from "lucide-react-native";
import { SettingsGroup } from "@/features/settings/components/settings-group";
import { SettingsSwitchRow } from "@/features/settings/components/settings-row";
import { useSettings } from "@/features/settings/store";

function NotificationsGroup() {
  const { settings, update } = useSettings();
  return (
    <SettingsGroup title="Notifikasi">
      <SettingsSwitchRow
        icon={MessageSquare}
        title="Titipan kata baru"
        soon
        checked={settings.notifComment}
        onChange={(value) => update("notifComment", value)}
      />
      <SettingsSwitchRow
        icon={Heart}
        title="Suka baru"
        soon
        checked={settings.notifLike}
        onChange={(value) => update("notifLike", value)}
      />
      <SettingsSwitchRow
        icon={History}
        title="Pengingat Hari Ini Dulu"
        soon
        checked={settings.notifOnThisDay}
        onChange={(value) => update("notifOnThisDay", value)}
      />
    </SettingsGroup>
  );
}

export { NotificationsGroup };

import { Bell, CircleHelp, MessageSquareHeart } from "lucide-react-native";
import { toast } from "@/components/ui/sonner";
import { SettingsGroup } from "@/features/settings/components/settings-group";
import { SettingsRow } from "@/features/settings/components/settings-row";

function HelpGroup() {
  return (
    <SettingsGroup title="Bantuan">
      <SettingsRow
        icon={CircleHelp}
        title="Pusat bantuan"
        onPress={() => toast.info("Pusat bantuan segera hadir")}
      />
      <SettingsRow
        icon={MessageSquareHeart}
        title="Kirim masukan"
        onPress={() => toast.info("Fitur kirim masukan segera hadir")}
      />
      <SettingsRow
        icon={Bell}
        title="Versi aplikasi"
        description="1.0.0 (dummy)"
      />
    </SettingsGroup>
  );
}

export { HelpGroup };

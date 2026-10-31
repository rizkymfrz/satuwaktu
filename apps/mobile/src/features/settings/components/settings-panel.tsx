import { View } from "react-native";
import { QueryError } from "@/components/layout/query-error";
import { Spinner } from "@/components/ui/spinner";
import { TypographyMuted } from "@/components/ui/typography";
import { useSession } from "@/features/session/store";
import { AppearanceGroup } from "@/features/settings/components/appearance-group";
import { DataGroup } from "@/features/settings/components/data-group";
import { HelpGroup } from "@/features/settings/components/help-group";
import { NotificationsGroup } from "@/features/settings/components/notifications-group";
import { PrivacyGroup } from "@/features/settings/components/privacy-group";
import { useSettings } from "@/features/settings/store";

function SettingsPanel() {
  const { role } = useSession();
  const { status, saving, retry } = useSettings();
  return (
    <View className="gap-8">
      {status === "loading" ? (
        <View className="items-center py-4">
          <Spinner size={28} />
        </View>
      ) : status === "error" ? (
        <QueryError
          message="Tidak bisa memuat pengaturan"
          onRetry={retry}
          className="py-4"
        />
      ) : (
        <>
          {role === "owner" ? (
            <View className="-mb-4 h-4 flex-row items-center justify-end gap-2">
              {saving ? (
                <>
                  <Spinner size={12} />
                  <TypographyMuted className="text-xs">
                    Menyimpan…
                  </TypographyMuted>
                </>
              ) : null}
            </View>
          ) : null}
          {role === "owner" ? <NotificationsGroup /> : null}
          {role === "owner" ? <PrivacyGroup /> : null}
          <AppearanceGroup />
          <DataGroup />
        </>
      )}
      <HelpGroup />
    </View>
  );
}

export { SettingsPanel };

import { useScrollToTop } from "expo-router";
import { useRef } from "react";
import { type ScrollViewInstance } from "react-native";
import { Screen } from "@/components/layout/screen";
import { ScreenScroll } from "@/components/layout/screen-scroll";
import { AboutLink } from "@/features/profile/components/about-link";
import { OwnerOverview } from "@/features/profile/components/owner-overview";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { SwitchAccountButton } from "@/features/profile/components/switch-account-button";
import { useSession } from "@/features/session/store";
import { SettingsPanel } from "@/features/settings/components/settings-panel";

function ProfileScreen() {
  const ref = useRef<ScrollViewInstance>(null);
  useScrollToTop(ref);
  const { role, account } = useSession();
  return (
    <Screen title="Profil">
      <ScreenScroll
        ref={ref}
        reveal={false}
        contentContainerClassName="gap-8 p-4 pb-8"
      >
        <ProfileHeader />
        {role === "owner" && account ? (
          <OwnerOverview accountId={account.id} />
        ) : null}
        <SettingsPanel />
        <AboutLink />
        <SwitchAccountButton />
      </ScreenScroll>
    </Screen>
  );
}

export { ProfileScreen };

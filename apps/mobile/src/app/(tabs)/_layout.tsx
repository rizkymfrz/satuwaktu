import { Redirect, Tabs, useRouter } from "expo-router";
import { ArchiveTabBar } from "@/components/layout/tab-bar";
import { useSession } from "@/features/session/store";

export default function TabsLayout() {
  const { role } = useSession();
  const router = useRouter();
  if (!role) {
    return <Redirect href="/" />;
  }
  return (
    <Tabs
      tabBar={(props) => <ArchiveTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="timeline" />
      <Tabs.Screen
        name="capture"
        options={{ href: role === "owner" ? undefined : null }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push("/fragments/new");
          },
        }}
      />
      <Tabs.Screen name="chapters" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

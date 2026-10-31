import { useFonts } from "expo-font";
import { ArchivoBlack_400Regular } from "@expo-google-fonts/archivo-black";
import { SpaceGrotesk_400Regular } from "@expo-google-fonts/space-grotesk";
import { Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { colorScheme } from "nativewind";
import { Platform } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { PortalHost } from "@rn-primitives/portal";
import { AnimatedSplashOverlay } from "@/components/layout/animated-icon";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/providers/app-providers";
import { NAVIGATION_THEME } from "@/theme/navigation-theme";
import "@/global.css";

function AppShell() {
  return (
    <ThemeProvider value={NAVIGATION_THEME}>
      <AnimatedSplashOverlay />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="fragments/[id]" />
        <Stack.Screen name="search" />
        <Stack.Screen name="about" />
        <Stack.Screen name="chapters/[id]" />
        <Stack.Screen name="map" />
        <Stack.Screen
          name="fragments/new"
          options={{ presentation: "fullScreenModal" }}
        />
        <Stack.Screen name="showcase" />
      </Stack>
      <PortalHost />
      <Toaster />
    </ThemeProvider>
  );
}

configureReanimatedLogger({ level: ReanimatedLogLevel.error });
SplashScreen.preventAutoHideAsync();

if (Platform.OS !== "web" || globalThis.window) {
  colorScheme.set("light");
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ArchivoBlack_400Regular,
    SpaceGrotesk_400Regular,
  });
  if (fontError) {
    throw fontError;
  }
  if (!fontsLoaded) {
    return null;
  }
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}

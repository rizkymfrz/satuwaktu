import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { QueryError } from "@/components/layout/query-error";

function RestoreFailed({ onRetry }: { onRetry: () => void }) {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);
  return (
    <View className="flex-1 bg-background">
      <QueryError
        message="Tidak bisa terhubung ke server"
        onRetry={onRetry}
        fill
      />
    </View>
  );
}

export { RestoreFailed };

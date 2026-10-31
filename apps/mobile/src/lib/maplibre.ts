import Constants, { ExecutionEnvironment } from "expo-constants";
import type * as MapLibre from "@maplibre/maplibre-react-native";
import * as Stub from "@/lib/maplibre-web";

const IS_EXPO_GO =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const { Camera, Map, Marker } = (IS_EXPO_GO
  ? Stub
  : require("@maplibre/maplibre-react-native")) as unknown as typeof MapLibre;

export { Camera, Map, Marker };
export type { CameraRef } from "@maplibre/maplibre-react-native";

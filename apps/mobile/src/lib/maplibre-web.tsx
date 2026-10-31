import { useImperativeHandle, type ReactNode, type Ref } from "react";
import { View, type ViewProps } from "react-native";

function Map({ style }: ViewProps & { children?: ReactNode }) {
  return <View style={style} />;
}

function Camera({ ref }: { ref?: Ref<{ easeTo: () => void }> }) {
  useImperativeHandle(ref, () => ({ easeTo: () => {} }), []);
  return null;
}

function Marker() {
  return null;
}

export { Camera, Map, Marker };

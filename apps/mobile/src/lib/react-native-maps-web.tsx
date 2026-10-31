import { useImperativeHandle, type ReactNode, type Ref } from "react";
import { View, type ViewProps } from "react-native";

function MapView({
  ref,
  style,
}: ViewProps & {
  ref?: Ref<{ animateToRegion: () => void }>;
  children?: ReactNode;
}) {
  useImperativeHandle(ref, () => ({ animateToRegion: () => {} }), []);
  return <View style={style} />;
}

function Marker() {
  return null;
}

export { Marker };
export default MapView;

import { Lock } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Enter } from "@/components/motion/enter";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { PinBadge } from "@/features/archive/components/pin-badge";
import { Polaroid } from "@/features/archive/components/polaroid";
import type { Fragment } from "@/features/archive/types";
import { PhotoViewer } from "@/features/fragments/components/detail/photo-viewer";
import { SongPlayer } from "@/features/fragments/components/song/song-player";

function FragmentHero({ fragment }: { fragment: Fragment }) {
  const [viewing, setViewing] = useState(false);
  return (
    <Enter className="px-2 pt-2">
      <Polaroid
        fragment={fragment}
        ratio={1 / Math.min(fragment.aspect, 1.25)}
        accessibilityLabel="Perbesar foto"
        animated={false}
        onPress={fragment.photoUrl ? () => setViewing(true) : undefined}
        overlay={
          fragment.song ? (
            <SongPlayer key={fragment.id} song={fragment.song} />
          ) : null
        }
      />
      {fragment.pinned ? (
        <PinBadge className="absolute -right-1 top-0" size={36} />
      ) : null}
      <View className="absolute left-4 top-4 flex-row gap-2">
        {fragment.visibility === "PRIVATE" ? (
          <Badge variant="secondary">
            <Icon as={Lock} size={11} />
            <Text>Pribadi</Text>
          </Badge>
        ) : null}
      </View>
      {fragment.photoUrl ? (
        <PhotoViewer
          uri={fragment.photoUrl}
          aspect={fragment.aspect}
          open={viewing}
          onClose={() => setViewing(false)}
        />
      ) : null}
    </Enter>
  );
}

export { FragmentHero };

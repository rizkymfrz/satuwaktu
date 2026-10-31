import { Lock } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Frame } from "@/components/scrapbook/frame";
import { Tape } from "@/components/scrapbook/tape";
import { Tilt } from "@/components/scrapbook/tilt";
import { hashSeed, pressShift } from "@/components/scrapbook/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { TypographySmall } from "@/components/ui/typography";
import { FragmentPhoto } from "@/features/archive/components/fragment-photo";
import { PinBadge } from "@/features/archive/components/pin-badge";
import type { Fragment } from "@/features/archive/types";
import { AccountName } from "@/features/session/components/account-name";

function FragmentTile({
  fragment,
  width,
  height: fixedHeight,
  onOpen,
}: {
  fragment: Fragment;
  width: number;
  height?: number;
  onOpen: () => void;
}) {
  const height = fixedHeight ?? Math.round(width * fragment.aspect);
  const taped = !fragment.pinned && hashSeed(fragment.id) % 4 === 0;
  return (
    <Tilt seed={fragment.id} max={1.5} style={{ width }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Buka fragmen: ${fragment.caption || "tanpa keterangan"}`}
        onPress={onOpen}
      >
        {({ pressed }) => (
          <>
            <Frame
              pressed={pressed}
              style={{ width, height }}
              contentClassName="p-2"
            >
              <View className="flex-1 overflow-hidden border-2 border-border">
                <FragmentPhoto
                  fragment={fragment}
                  className="absolute inset-0"
                />
                <View className="absolute left-2 top-2 flex-row gap-2">
                  {fragment.visibility === "PRIVATE" ? (
                    <Badge variant="secondary">
                      <Icon as={Lock} size={11} />
                    </Badge>
                  ) : null}
                </View>
                <View className="absolute inset-x-0 bottom-0 gap-2 border-t-2 border-border bg-card/95 p-2">
                  {fragment.caption ? (
                    <TypographySmall
                      numberOfLines={1}
                      className="text-xs font-normal leading-4"
                    >
                      {fragment.caption}
                    </TypographySmall>
                  ) : null}
                  <View className="flex-row items-center gap-2">
                    <Avatar
                      alt={fragment.uploader.name}
                      size="sm"
                      className="size-5"
                    >
                      <AvatarFallback>
                        <TypographySmall className="text-[10px]">
                          {fragment.uploader.name.charAt(0).toUpperCase()}
                        </TypographySmall>
                      </AvatarFallback>
                    </Avatar>
                    <View className="flex-1">
                      <AccountName
                        account={fragment.uploader}
                        className="text-[10px]"
                        iconSize={10}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Frame>
            {fragment.pinned ? (
              <PinBadge className="absolute -right-1 -top-2" size={28} />
            ) : null}
            {taped ? (
              <Tape
                seed={fragment.id}
                width={48}
                height={16}
                className="absolute -top-2 self-center"
                style={pressShift(pressed)}
              />
            ) : null}
          </>
        )}
      </Pressable>
    </Tilt>
  );
}

export { FragmentTile };

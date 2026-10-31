import { useRouter } from "expo-router";
import { Lock } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { HighlightedText } from "@/components/layout/highlighted-text";
import { Frame } from "@/components/scrapbook/frame";
import { Icon } from "@/components/ui/icon";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { FragmentPhoto } from "@/features/archive/components/fragment-photo";
import type { Fragment } from "@/features/archive/types";
import { formatDate } from "@/lib/format";

function FragmentRow({
  fragment,
  highlight = "",
  onOpen,
}: {
  fragment: Fragment;
  highlight?: string;
  onOpen?: () => void;
}) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        onOpen?.();
        router.push({
          pathname: "/fragments/[id]",
          params: { id: fragment.id },
        });
      }}
    >
      {({ pressed }) => (
        <Frame
          pressed={pressed}
          contentClassName="flex-row items-center gap-4 p-2"
        >
          <FragmentPhoto
            fragment={fragment}
            className="size-14 border-2 border-border"
          />
          <View className="flex-1 gap-0.5">
            <TypographySmall numberOfLines={1} className="text-base">
              {fragment.caption ? (
                <HighlightedText text={fragment.caption} term={highlight} />
              ) : (
                "Tanpa keterangan"
              )}
            </TypographySmall>
            <TypographyMuted className="text-xs">
              {fragment.chapter ? (
                <>
                  <HighlightedText
                    text={fragment.chapter.name}
                    term={highlight}
                  />
                  {" · "}
                </>
              ) : null}
              {formatDate(fragment.takenAt)}
            </TypographyMuted>
          </View>
          {fragment.visibility === "PRIVATE" ? (
            <Icon as={Lock} size={14} />
          ) : null}
        </Frame>
      )}
    </Pressable>
  );
}

export { FragmentRow };

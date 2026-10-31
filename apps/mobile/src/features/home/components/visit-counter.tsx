import { Eye } from "lucide-react-native";
import { View } from "react-native";
import { useArchive } from "@repo/sdk";
import { Paper } from "@/components/scrapbook/paper";
import { Icon } from "@/components/ui/icon";
import { TypographySmall } from "@/components/ui/typography";
import { formatCount } from "@/lib/format";

function VisitCounter() {
  const { data } = useArchive();
  if (!data) {
    return null;
  }
  return (
    <View className="mx-4 pr-1">
      <Paper
        variant="plain"
        seed="kunjungan"
        tilt={0.8}
        contentClassName="flex-row items-center justify-center gap-2 px-4 py-2"
      >
        <Icon as={Eye} size={14} />
        <TypographySmall className="font-normal">
          {formatCount(data.visitCount)} kali arsip ini disinggahi
        </TypographySmall>
      </Paper>
    </View>
  );
}

export { VisitCounter };

import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ButtonRow } from "@/components/layout/button-row";
import { Paper } from "@/components/scrapbook/paper";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TypographyMuted } from "@/components/ui/typography";
import { Space } from "@/theme/space";

function FormFooter({
  canSave,
  saving,
  onCancel,
  onSave,
}: {
  canSave: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View>
      <Paper
        variant="kraft"
        seed="footer"
        shadow={false}
        bleed={{ bottom: Space.lg, left: Space.md, right: Space.md }}
        contentClassName="px-4 pb-0 pt-4"
      >
        <View
          className="gap-2"
          style={{ paddingBottom: Math.max(insets.bottom, Space.lg) }}
        >
          {!canSave && !saving ? (
            <TypographyMuted className="text-center text-xs">
              Tambahkan foto atau cerita dulu untuk menyimpan.
            </TypographyMuted>
          ) : null}
          <ButtonRow>
            <Button variant="outline" shadowSize="md" onPress={onCancel}>
              <Text>Batal</Text>
            </Button>
            <Button shadowSize="md" disabled={!canSave} onPress={onSave}>
              <Text>{saving ? "Menyimpan..." : "Simpan"}</Text>
            </Button>
          </ButtonRow>
        </View>
      </Paper>
    </View>
  );
}

export { FormFooter };

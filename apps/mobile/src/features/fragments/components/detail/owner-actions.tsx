import { Pencil, Pin, PinOff, Trash2 } from "lucide-react-native";
import { View } from "react-native";
import { ButtonRow } from "@/components/layout/button-row";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

function OwnerActions({
  pinned,
  onEdit,
  onTogglePin,
  onDelete,
}: {
  pinned: boolean;
  onEdit: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  return (
    <View className="pr-1">
      <ButtonRow>
        <Button
          variant="secondary"
          size="sm"
          accessibilityLabel="Edit fragmen"
          onPress={onEdit}
        >
          <Icon as={Pencil} size={14} />
          <Text>Edit</Text>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          accessibilityLabel={pinned ? "Lepas sematan" : "Sematkan"}
          onPress={onTogglePin}
        >
          <Icon as={pinned ? PinOff : Pin} size={14} />
          <Text>{pinned ? "Lepas" : "Sematkan"}</Text>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          accessibilityLabel="Hapus fragmen"
          onPress={onDelete}
        >
          <Icon as={Trash2} size={14} />
          <Text>Hapus</Text>
        </Button>
      </ButtonRow>
    </View>
  );
}

export { OwnerActions };

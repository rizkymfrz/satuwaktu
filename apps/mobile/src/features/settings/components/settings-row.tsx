import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Switch } from "@/components/ui/switch";

const SOON_LABEL = "Segera hadir";

function SettingsRow({
  icon,
  title,
  description,
  onPress,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  onPress?: () => void;
  children?: ReactNode;
}) {
  return (
    <Item className="rounded-sm" onPress={onPress} accessibilityLabel={title}>
      <ItemMedia variant="icon">
        <Icon as={icon} size={18} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {description ? <ItemDescription>{description}</ItemDescription> : null}
      </ItemContent>
      {children ? <ItemActions>{children}</ItemActions> : null}
    </Item>
  );
}

function SettingsSwitchRow({
  icon,
  title,
  description,
  checked,
  onChange,
  soon = false,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  soon?: boolean;
}) {
  return (
    <SettingsRow
      icon={icon}
      title={title}
      description={soon ? SOON_LABEL : description}
    >
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={soon}
        accessibilityLabel={title}
      />
    </SettingsRow>
  );
}

export { SettingsRow, SettingsSwitchRow, SOON_LABEL };

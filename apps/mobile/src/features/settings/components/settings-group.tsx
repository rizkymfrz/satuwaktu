import { Children, Fragment, type ReactNode } from "react";
import { View } from "react-native";
import { Paper } from "@/components/scrapbook/paper";
import { ItemSeparator } from "@/components/ui/item";
import { TypographyH4 } from "@/components/ui/typography";

function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const rows = Children.toArray(children);
  return (
    <View className="gap-4">
      <TypographyH4 className="font-head">{title}</TypographyH4>
      <View className="pr-1">
        <Paper variant="plain" seed={title} contentClassName="p-0.5">
          {rows.map((row, index) => (
            <Fragment key={index}>
              {index > 0 ? <ItemSeparator className="my-0" /> : null}
              {row}
            </Fragment>
          ))}
        </Paper>
      </View>
    </View>
  );
}

export { SettingsGroup };

import type { ComponentProps } from "react";
import { View, type ViewProps } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type TypographyProps = Omit<ComponentProps<typeof Text>, "variant">;

function TypographyH1(props: TypographyProps) {
  return <Text variant="h1" {...props} />;
}

function TypographyH2(props: TypographyProps) {
  return <Text variant="h2" {...props} />;
}

function TypographyH3(props: TypographyProps) {
  return <Text variant="h3" {...props} />;
}

function TypographyH4(props: TypographyProps) {
  return <Text variant="h4" {...props} />;
}

function TypographyP(props: TypographyProps) {
  return <Text variant="p" {...props} />;
}

function TypographyBlockquote(props: TypographyProps) {
  return <Text variant="blockquote" {...props} />;
}

function TypographyInlineCode(props: TypographyProps) {
  return <Text variant="code" {...props} />;
}

function TypographyLarge(props: TypographyProps) {
  return <Text variant="large" {...props} />;
}

function TypographySmall(props: TypographyProps) {
  return <Text variant="small" {...props} />;
}

function TypographyLead(props: TypographyProps) {
  return <Text variant="lead" {...props} />;
}

function TypographyMuted(props: TypographyProps) {
  return <Text variant="muted" {...props} />;
}

function TypographyList({ className, ...props }: ViewProps) {
  return (
    <View role="list" className={cn("my-6 ml-6 gap-2", className)} {...props} />
  );
}

function TypographyListItem({ className, children, ...props }: ViewProps) {
  return (
    <View
      role="listitem"
      className={cn("flex-row gap-2", className)}
      {...props}
    >
      <Text aria-hidden>{"•"}</Text>
      {typeof children === "string" ? (
        <Text className="flex-1">{children}</Text>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </View>
  );
}

export {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyListItem,
  TypographyMuted,
  TypographyP,
  TypographySmall,
};

export type { TypographyProps };

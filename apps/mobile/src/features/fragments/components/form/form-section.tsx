import type { ReactNode } from "react";
import { View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";

function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Animated.View className="gap-4" layout={LinearTransition}>
      <View className="gap-2">
        <TypographySmall className="text-base">{title}</TypographySmall>
        {hint ? (
          <TypographyMuted className="text-xs">{hint}</TypographyMuted>
        ) : null}
      </View>
      {children}
    </Animated.View>
  );
}

export { FormSection };

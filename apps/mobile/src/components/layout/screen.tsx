import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";
import { PaperHeader } from "@/components/layout/paper-header";
import { PatternBackground } from "@/components/scrapbook/pattern-background";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TypographyH4 } from "@/components/ui/typography";

type ScreenProps = {
  children: ReactNode;
  title?: string;
  back?: boolean;
  header?: ReactNode;
};

function Screen({ title = "", back = false, header, children }: ScreenProps) {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background">
      <PatternBackground variant="dots" />
      {header ?? (
        <PaperHeader seed={title}>
          {back ? (
            <Button
              variant="outline"
              size="icon"
              shadowSize="md"
              accessibilityLabel="Kembali"
              onPress={() => router.back()}
            >
              <Icon as={ArrowLeft} size={18} />
            </Button>
          ) : null}
          <TypographyH4 className="font-head">{title}</TypographyH4>
        </PaperHeader>
      )}
      {children}
    </View>
  );
}

export { Screen };

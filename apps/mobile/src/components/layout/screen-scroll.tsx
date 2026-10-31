import { Fragment, type ComponentProps } from "react";
import { ScrollView } from "react-native";
import { usePullRefresh } from "@/components/layout/pull-refresh";
import { RevealScrollView } from "@/components/motion/reveal";

type ScreenScrollProps = ComponentProps<typeof RevealScrollView> & {
  reveal?: boolean;
};

function ScreenScroll({
  children,
  reveal = true,
  onNearEnd,
  ...props
}: ScreenScrollProps) {
  const { control, version } = usePullRefresh();
  const content = <Fragment key={version}>{children}</Fragment>;
  if (!reveal) {
    return (
      <ScrollView refreshControl={control} {...props}>
        {content}
      </ScrollView>
    );
  }
  return (
    <RevealScrollView refreshControl={control} onNearEnd={onNearEnd} {...props}>
      {content}
    </RevealScrollView>
  );
}

export { ScreenScroll };

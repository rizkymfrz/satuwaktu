import { usePaper } from "@/components/scrapbook/use-paper";
import { ShadowBox, type ShadowBoxProps } from "@/components/ui/shadow-box";
import { cn } from "@/lib/utils";

function Frame({ style, contentClassName, ...props }: ShadowBoxProps) {
  const paper = usePaper();
  return (
    <ShadowBox
      style={[{ backgroundColor: paper.cream }, style]}
      contentClassName={cn(
        "rounded-md border-2 border-border",
        contentClassName,
      )}
      {...props}
      size="md"
    />
  );
}

export { Frame };

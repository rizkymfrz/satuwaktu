import type { LucideIcon, LucideProps } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { useContext, type RefAttributes } from "react";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type IconProps = LucideProps & {
  as: LucideIcon;
} & RefAttributes<LucideIcon>;

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

cssInterop(IconImpl, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: "size",
      width: "size",
    },
  },
});

function Icon({
  as: IconComponent,
  className,
  size = 14,
  ...props
}: IconProps) {
  const textClass = useContext(TextClassContext);
  return (
    <IconImpl
      as={IconComponent}
      className={cn("text-foreground", textClass, className)}
      size={size}
      {...props}
    />
  );
}

export { Icon };

import type { ComponentProps } from "react";
import { ScrollView, View, type ViewProps } from "react-native";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function Table({ className, children, ...props }: ViewProps) {
  return (
    <ShadowBox
      size="md"
      className="mb-1 mr-1"
      contentClassName="overflow-hidden rounded-md border-2 border-border bg-card"
    >
      <ScrollView
        horizontal
        nestedScrollEnabled
        bounces={false}
        alwaysBounceHorizontal={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="grow"
      >
        <View role="table" className={cn("grow", className)} {...props}>
          {children}
        </View>
      </ScrollView>
    </ShadowBox>
  );
}

function TableHeader({ className, ...props }: ViewProps) {
  return <View className={cn("bg-muted", className)} {...props} />;
}

function TableBody({ className, ...props }: ViewProps) {
  return <View className={cn("-mb-0.5", className)} {...props} />;
}

function TableFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("border-t-2 border-border bg-muted", className)}
      {...props}
    />
  );
}

function TableRow({
  className,
  selected = false,
  ...props
}: ViewProps & { selected?: boolean }) {
  return (
    <View
      role="row"
      aria-selected={selected}
      className={cn(
        "flex-row items-stretch border-b-2 border-border",
        selected && "bg-accent",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, children, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="font-head text-sm text-foreground">
      <View
        role="columnheader"
        className={cn(
          "min-h-12 min-w-28 flex-1 justify-center px-3 py-1",
          className,
        )}
        {...props}
      >
        {typeof children === "string" ? <Text>{children}</Text> : children}
      </View>
    </TextClassContext.Provider>
  );
}

function TableCell({ className, children, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-sm text-foreground">
      <View
        role="cell"
        className={cn("min-w-28 flex-1 justify-center px-3 py-2", className)}
        {...props}
      >
        {typeof children === "string" ? <Text>{children}</Text> : children}
      </View>
    </TextClassContext.Provider>
  );
}

function TableCaption({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "mt-4 text-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};

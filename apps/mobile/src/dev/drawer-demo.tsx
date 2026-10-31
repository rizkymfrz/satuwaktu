import { View } from "react-native";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerDirection,
} from "@/components/ui/drawer";
import { Text } from "@/components/ui/text";

const DIRECTIONS: DrawerDirection[] = ["bottom", "top", "left", "right"];

function DrawerDemo() {
  return (
    <View className="flex-row flex-wrap gap-4">
      {DIRECTIONS.map((direction) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline">
              <Text className="capitalize">{direction}</Text>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal. Swipe toward the edge to dismiss.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>
                <Text>Submit</Text>
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">
                  <Text>Cancel</Text>
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </View>
  );
}

export { DrawerDemo };

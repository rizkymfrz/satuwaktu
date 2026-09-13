import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQ_ITEMS = [
  {
    value: "item-1",
    question: "What is this?",
    answer:
      "A demo screen for components ported from neobrutalism.com to React Native Reusables.",
  },
  {
    value: "item-2",
    question: "Is it accessible?",
    answer:
      "Yes. It's built on @rn-primitives, which mirrors the same primitives Radix UI uses on web.",
  },
  {
    value: "item-3",
    question: "Is it animated?",
    answer:
      "Yes, via react-native-reanimated — the chevron rotation and panel transition both run natively.",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="gap-6 p-4">
          <Text variant="h2">Components</Text>
          <View className="gap-2">
            <Text variant="muted">Accordion</Text>
            <Accordion type="single" collapsible defaultValue="item-1">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger>
                    <Text>{item.question}</Text>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Text>{item.answer}</Text>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

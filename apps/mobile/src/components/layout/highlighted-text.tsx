import { Text } from "@/components/ui/text";
import { splitByTerm } from "@/lib/highlight";

function HighlightedText({ text, term }: { text: string; term: string }) {
  return splitByTerm(text, term).map((segment, index) =>
    segment.match ? (
      <Text
        key={`${index}-${segment.text}`}
        className="bg-primary text-primary-foreground"
      >
        {segment.text}
      </Text>
    ) : (
      segment.text
    ),
  );
}

export { HighlightedText };

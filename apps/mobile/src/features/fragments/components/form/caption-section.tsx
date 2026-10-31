import { View } from "react-native";
import { MAX_CAPTION_LENGTH } from "@repo/dto";
import { Textarea } from "@/components/ui/textarea";
import { TypographyMuted } from "@/components/ui/typography";
import { FormSection } from "@/features/fragments/components/form/form-section";

function CaptionSection({
  caption,
  onChange,
}: {
  caption: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormSection title="Cerita">
      <View className="gap-2">
        <Textarea
          value={caption}
          onChangeText={onChange}
          maxLength={MAX_CAPTION_LENGTH}
          placeholder="Apa yang masih terasa dari momen ini?"
          accessibilityLabel="Caption"
        />
        <TypographyMuted className="text-right text-xs">
          {caption.length}/{MAX_CAPTION_LENGTH}
        </TypographyMuted>
      </View>
    </FormSection>
  );
}

export { CaptionSection };

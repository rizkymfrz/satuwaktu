import {
  Combobox,
  ComboboxContent,
  ComboboxCreate,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { ChapterRef } from "@/features/archive/types";
import { FormSection } from "@/features/fragments/components/form/form-section";

function ChapterSection({
  chapters,
  chapterId,
  onChange,
  onCreate,
}: {
  chapters: ChapterRef[];
  chapterId: string | null;
  onChange: (value: string | null) => void;
  onCreate: (name: string) => Promise<ChapterRef | null>;
}) {
  return (
    <FormSection title="Babak" hint="Satukan fragmen ini ke dalam satu babak.">
      <Combobox
        value={chapterId}
        onValueChange={(value) => {
          if (value === null) {
            onChange(null);
            return;
          }
          const known = chapters.find((item) => item.id === value);
          if (known) {
            onChange(known.id);
            return;
          }
          void onCreate(value).then((created) => onChange(created?.id ?? null));
        }}
      >
        <ComboboxInput
          placeholder="Tanpa babak"
          accessibilityLabel="Babak"
          showClear
          closeOnBlur={false}
        />
        <ComboboxContent>
          <ComboboxList>
            {chapters.map((item) => (
              <ComboboxItem key={item.id} value={item.id} label={item.name}>
                {item.name}
              </ComboboxItem>
            ))}
            <ComboboxCreate label={(text) => `Buat babak "${text}"`} />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </FormSection>
  );
}

export { ChapterSection };

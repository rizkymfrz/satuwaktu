import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { TitipanKata } from "@satuwaktu/types";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Separator } from "@/shared/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

interface TitipanKataListProps {
  items: TitipanKata[];
}

export const TitipanKataList = ({ items }: TitipanKataListProps) => {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Belum ada titipan kata.
      </p>
    );
  }

  return (
    <ScrollArea className="max-h-72">
      <div className="space-y-4 pr-4">
        {items.map((t, i) => (
          <div key={t.id}>
            {i > 0 && <Separator className="mb-4" />}
            <div className="flex gap-3">
              <Avatar size="sm" className="bg-muted">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${t.id}`}
                  alt="Avatar"
                />
                <AvatarFallback>TK</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Seseorang yang Singgah
                </p>
                <p className="text-xs leading-relaxed">{t.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {format(new Date(t.createdAt), "d MMM yyyy · HH:mm", {
                    locale: id,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

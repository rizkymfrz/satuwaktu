import Image from "next/image";
import Link from "next/link";
import type { FragmenWithRelations } from "@satuwaktu/types";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { ScrapbookDecor } from "./scrapbook-decor";

interface FragmenCardProps {
  fragmen: FragmenWithRelations;
}

export const FragmenCard = ({ fragmen }: FragmenCardProps) => {
  const cover = fragmen.media[0];

  return (
    <Link href={`/fragmen/${fragmen.id}`}>
      <div className="relative">
        {cover && (
          <ScrapbookDecor fragmenId={fragmen.id} takenAt={fragmen.takenAt} />
        )}
        <Card className="overflow-hidden p-0 border">
          {cover ? (
            <Image
              src={cover.url}
              alt={fragmen.caption ?? fragmen.title ?? "fragmen"}
              width={0}
              height={0}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="h-auto w-full object-cover"
              quality={100}
            />
          ) : (
            <div className="min-h-24 flex items-center justify-center bg-muted p-4">
              <p className="text-center text-sm text-muted-foreground italic">
                {fragmen.caption ?? fragmen.title ?? "—"}
              </p>
            </div>
          )}
        </Card>
      </div>
    </Link>
  );
};

export const FragmenCardSkeleton = () => {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="h-40 w-full" />
    </Card>
  );
};

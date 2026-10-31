import { useFragments, useProfileStats } from "@repo/sdk";
import { QueryError } from "@/components/layout/query-error";
import { toFragment } from "@/features/archive/from-api";
import { ProfileStats } from "@/features/profile/components/profile-stats";
import { ProfileStatsSkeleton } from "@/features/profile/components/profile-stats-skeleton";
import { RecentUploads } from "@/features/profile/components/recent-uploads";

const RECENT_LIMIT = 8;

function OwnerOverview({ accountId }: { accountId: string }) {
  const stats = useProfileStats();
  const recent = useFragments({ uploaderId: accountId, limit: RECENT_LIMIT });
  if (stats.isPending) {
    return <ProfileStatsSkeleton />;
  }
  if (stats.isError) {
    return (
      <QueryError
        message="Tidak bisa memuat statistik"
        onRetry={() => stats.refetch()}
        className="py-4"
      />
    );
  }
  const items = recent.data?.pages[0]?.items.map(toFragment) ?? [];
  return (
    <>
      <ProfileStats
        fragments={stats.data.fragmentCount}
        likes={stats.data.likeCount}
        notes={stats.data.commentCount}
      />
      {recent.isError && items.length === 0 ? (
        <QueryError
          message="Tidak bisa memuat unggahan terbaru"
          onRetry={() => recent.refetch()}
        />
      ) : (
        <RecentUploads fragments={items} />
      )}
    </>
  );
}

export { OwnerOverview };

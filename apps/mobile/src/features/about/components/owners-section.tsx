import { UserRound } from "lucide-react-native";
import { View } from "react-native";
import { useAccounts, useArchive } from "@repo/sdk";
import { Enter } from "@/components/motion/enter";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import {
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/components/ui/typography";
import { SectionSkeleton } from "@/features/about/components/section-skeleton";
import { SectionState } from "@/features/about/components/section-state";
import { ACCOUNT_ICON } from "@/features/session/components/account-name";
import { formatDate } from "@/lib/format";

function OwnersSection() {
  const accounts = useAccounts();
  const archive = useArchive();
  return (
    <View className="gap-4">
      <TypographyH4 className="font-head">Dua yang menjaga</TypographyH4>
      {accounts.data ? (
        <View className="gap-4">
          {accounts.data.map((account, index) => (
            <Enter key={account.id} index={index}>
              <TapedPaper
                tape={index % 2 === 0 ? "left" : "right"}
                seed={account.id}
                tilt={index % 2 === 0 ? -0.8 : 0.8}
                contentClassName="flex-row items-center gap-4 p-4"
              >
                <View className="size-14">
                  <Avatar alt={account.name} className="size-14">
                    <AvatarFallback className="bg-primary">
                      <Icon
                        as={ACCOUNT_ICON[account.id] ?? UserRound}
                        size={24}
                        strokeWidth={2}
                      />
                    </AvatarFallback>
                  </Avatar>
                </View>
                <View className="flex-1 gap-1">
                  <TypographySmall numberOfLines={1} className="text-base">
                    {account.name}
                  </TypographySmall>
                  <TypographyMuted>{account.title}</TypographyMuted>
                </View>
              </TapedPaper>
            </Enter>
          ))}
        </View>
      ) : (
        <SectionState
          status={accounts.isError ? "error" : "loading"}
          skeleton={<SectionSkeleton count={2} height={88} />}
          onRetry={() => accounts.refetch()}
        />
      )}
      {archive.data ? (
        <TypographyMuted>
          Semuanya bermula pada {formatDate(archive.data.startedAt)}, nyaris
          tanpa disengaja.
        </TypographyMuted>
      ) : null}
    </View>
  );
}

export { OwnersSection };

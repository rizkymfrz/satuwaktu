import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SettingsView, TextSize } from "@repo/dto";
import { useSettings as useRemoteSettings, useUpdateSettings } from "@repo/sdk";
import { toast } from "@/components/ui/sonner";
import { useSession } from "@/features/session/store";

type Settings = SettingsView;
type SettingsStatus = "loading" | "error" | "ready";

type SettingsValue = {
  settings: Settings;
  status: SettingsStatus;
  saving: boolean;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  retry: () => void;
};

const INITIAL: Settings = {
  notifComment: true,
  notifLike: false,
  notifOnThisDay: true,
  dataSaver: false,
  autoSavePhotos: true,
  textSize: "NORMAL",
  defaultVisibility: "PUBLIC",
};

const SettingsContext = createContext<SettingsValue | null>(null);

function SettingsProvider({ children }: { children: ReactNode }) {
  const { role } = useSession();
  const owner = role === "owner";
  const remote = useRemoteSettings({ enabled: owner });
  const { mutate, isPending, variables } = useUpdateSettings();
  const [local, setLocal] = useState<Settings>(INITIAL);
  const settings = useMemo<Settings>(() => {
    if (!owner) {
      return local;
    }
    const base = remote.data ?? INITIAL;
    return isPending ? { ...base, ...variables } : base;
  }, [owner, local, remote.data, isPending, variables]);
  const status: SettingsStatus = !owner
    ? "ready"
    : remote.data
      ? "ready"
      : remote.isError
        ? "error"
        : "loading";
  const value = useMemo<SettingsValue>(
    () => ({
      settings,
      status,
      saving: owner && isPending,
      update: (key, next) => {
        if (!owner) {
          setLocal((current) => ({ ...current, [key]: next }));
          return;
        }
        mutate({ [key]: next } as Partial<Settings>, {
          onError: () => toast.error("Gagal menyimpan pengaturan."),
        });
      },
      retry: () => {
        void remote.refetch();
      },
    }),
    [settings, status, owner, isPending, mutate, remote],
  );
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return value;
}

export { SettingsProvider, useSettings };
export type { Settings, SettingsStatus, TextSize };

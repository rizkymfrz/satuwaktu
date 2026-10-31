import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { LoginParams } from "@repo/dto";
import {
  getMe,
  isApiError,
  login,
  useApiClient,
  type ApiClient,
} from "@repo/sdk";
import { toast } from "@/components/ui/sonner";
import { RestoreFailed } from "@/features/session/components/restore-failed";
import type { Account, Role } from "@/features/session/types";
import { tokenStorage } from "@/lib/api";

type SessionValue = {
  role: Role | null;
  account: Account | null;
  signIn: (credentials: LoginParams) => Promise<void>;
  enterAsGuest: () => void;
  signOut: () => Promise<void>;
};

type Restoration =
  | { status: "restoring" }
  | { status: "offline" }
  | { status: "ready"; account: Account | null };

const SessionContext = createContext<SessionValue | null>(null);

async function restoreOwner(http: ApiClient["http"]): Promise<Restoration> {
  if (!(await tokenStorage.get())) {
    return { status: "ready", account: null };
  }
  try {
    const me = await getMe(http);
    return {
      status: "ready",
      account: me.role === "owner" ? me.account : null,
    };
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      await tokenStorage.clear();
      return { status: "ready", account: null };
    }
    return { status: "offline" };
  }
}

function SessionProvider({ children }: { children: ReactNode }) {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  const [restoration, setRestoration] = useState<Restoration>({
    status: "restoring",
  });
  const [attempt, setAttempt] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  useEffect(() => {
    let active = true;
    restoreOwner(http).then((result) => {
      if (!active) {
        return;
      }
      if (result.status === "ready" && result.account) {
        setAccount(result.account);
        setRole("owner");
      }
      setRestoration(result);
    });
    return () => {
      active = false;
    };
  }, [http, attempt]);
  const signOut = useMemo(
    () => async () => {
      await tokenStorage.clear();
      queryClient.clear();
      setAccount(null);
      setRole(null);
    },
    [queryClient],
  );
  useEffect(() => {
    if (role !== "owner") {
      return;
    }
    const expireOnUnauthorized = (error: unknown) => {
      if (isApiError(error) && error.status === 401) {
        toast.error("Sesi berakhir. Masuk lagi.");
        void signOut();
      }
    };
    const stopQueries = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        expireOnUnauthorized(event.action.error);
      }
    });
    const stopMutations = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        expireOnUnauthorized(event.action.error);
      }
    });
    return () => {
      stopQueries();
      stopMutations();
    };
  }, [role, queryClient, signOut]);
  const value = useMemo<SessionValue>(
    () => ({
      role,
      account,
      signIn: async (credentials) => {
        const session = await login(http, credentials);
        await tokenStorage.set(session.accessToken);
        queryClient.clear();
        setAccount(session.account);
        setRole("owner");
      },
      enterAsGuest: () => {
        setAccount(null);
        setRole("guest");
      },
      signOut,
    }),
    [role, account, http, queryClient, signOut],
  );
  if (restoration.status === "restoring") {
    return null;
  }
  if (restoration.status === "offline") {
    return (
      <RestoreFailed
        onRetry={() => {
          setRestoration({ status: "restoring" });
          setAttempt((current) => current + 1);
        }}
      />
    );
  }
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return value;
}

export { SessionProvider, useSession };

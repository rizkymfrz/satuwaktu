import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl } from "react-native";

const REFRESH_MS = 600;

function usePullRefresh(delay = REFRESH_MS) {
  const [refreshing, setRefreshing] = useState(false);
  const [version, setVersion] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    timer.current = setTimeout(() => {
      setVersion((current) => current + 1);
      setRefreshing(false);
    }, delay);
  }, [delay]);
  const control = (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  );
  return { control, version };
}

export { usePullRefresh };

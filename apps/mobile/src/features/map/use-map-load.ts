import { useEffect, useRef, useState } from "react";

const LOAD_TIMEOUT_MS = 15000;

function useMapLoad() {
  const readyRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    readyRef.current = false;
    const timer = setTimeout(() => {
      if (!readyRef.current) {
        setFailed(true);
      }
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [attempt]);
  const retry = () => {
    setReady(false);
    setFailed(false);
    setAttempt((current) => current + 1);
  };
  const onMapReady = () => {
    readyRef.current = true;
    setReady(true);
    setFailed(false);
  };
  return { ready, failed, attempt, retry, onMapReady };
}

export { useMapLoad };

import { createContext, useContext } from "react";

const ScrollLockContext = createContext<(locked: boolean) => void>(() => {});

function useScrollLock() {
  return useContext(ScrollLockContext);
}

export { ScrollLockContext, useScrollLock };

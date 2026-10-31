import { createContext, useContext, type ReactNode } from "react";

type Direction = "ltr" | "rtl";

type DirectionProviderProps = {
  dir?: Direction;
  direction?: Direction;
  children?: ReactNode;
};

const DirectionContext = createContext<Direction | undefined>(undefined);

function DirectionProvider({
  dir,
  direction,
  children,
}: DirectionProviderProps) {
  return (
    <DirectionContext.Provider value={direction ?? dir}>
      {children}
    </DirectionContext.Provider>
  );
}

function useDirection(localDir?: Direction): Direction {
  const globalDir = useContext(DirectionContext);
  return localDir ?? globalDir ?? "ltr";
}

export { DirectionProvider, useDirection };
export type { Direction };

"use client";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";

const OwnerContext = createContext(false);

export const OwnerProvider = ({
  isOwner,
  children,
}: {
  isOwner: boolean;
  children: ReactNode;
}) => <OwnerContext.Provider value={isOwner}>{children}</OwnerContext.Provider>;

export const useIsOwner = () => useContext(OwnerContext);

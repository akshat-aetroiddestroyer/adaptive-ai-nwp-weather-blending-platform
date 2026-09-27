import { createContext, useContext } from "react";
import type { SectionId } from "@/lib/mock-data";

type NavContextValue = {
  section: SectionId;
  setSection: (id: SectionId) => void;
};

export const NavContext = createContext<NavContextValue | null>(null);

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside AppShell");
  return ctx;
}

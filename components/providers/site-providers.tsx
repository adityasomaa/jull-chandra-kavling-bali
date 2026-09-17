"use client";

import type { ReactNode } from "react";
import { TransitionLayer } from "@/components/transition/transition-layer";
import { TransitionProvider } from "@/components/transition/transition-provider";
import { SmoothScrollProvider } from "./smooth-scroll";
import { UiLockProvider } from "./ui-lock";

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <UiLockProvider>
      <SmoothScrollProvider>
        <TransitionProvider>
          {children}
          <TransitionLayer />
        </TransitionProvider>
      </SmoothScrollProvider>
    </UiLockProvider>
  );
}

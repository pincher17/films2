"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { SavedProvider } from "@/components/SavedProvider/SavedProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <SavedProvider>{children}</SavedProvider>
      </Provider>
    </SessionProvider>
  );
}

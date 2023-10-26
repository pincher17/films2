'use client'

import AllBlur from "@/components/AllBlur/AllBlur";
import Header from "@/components/Header/Header";
import MobileNavigation from "@/components/MobileNavigation/MobileNavigation";
import type { PropsWithChildren } from "react";

export default function DashboardLayout({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <>
    <AllBlur />
    <Header />
    {children}
    <MobileNavigation />
    </>
  )
}

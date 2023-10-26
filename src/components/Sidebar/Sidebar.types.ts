import { ReactNode } from "react"

export interface SidebarContainerProps {
    isopen: number
}

export interface SidebarProps {
    isOpenSidebar: number
    toggleSidebar: () => void
    children: ReactNode
}


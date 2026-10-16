import React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { SheetClose, SheetGrabber, SheetHeader, SheetInner } from "../../app/styles/Sidebar.styles";
import { SidebarProps } from "./Sidebar.types";

/**
 * Панель фильтров на телефоне — «шторка» снизу на готовом компоненте MUI.
 *
 * Жест не написан руками: SwipeableDrawer сам разбирается, что делает палец —
 * прокручивает список или закрывает панель, и сам считает инерцию и пороги.
 * Своя реализация на это и развалилась.
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpenSidebar, toggleSidebar, children }) => {
  const open = !!+isOpenSidebar;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={() => undefined}
      onClose={toggleSidebar}
      disableSwipeToOpen
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          /* vh считает высоту вместе с интерфейсом браузера, поэтому на
             телефоне шторка занимала почти весь экран. dvh учитывает панели
             браузера; vh оставлен как запасной вариант для старых версий. */
          height: "78vh",
          maxHeight: "78vh",
          "@supports (height: 100dvh)": {
            height: "78dvh",
            maxHeight: "78dvh",
          },
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          background: "rgba(21, 21, 21, 0.97)",
          color: "#fff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundImage: "none",
        },
      }}
    >
      <SheetInner>
        <SheetHeader>
          <SheetGrabber />
          <SheetClose type="button" aria-label="Закрыть фильтры" onClick={toggleSidebar} />
        </SheetHeader>
        {children}
      </SheetInner>
    </SwipeableDrawer>
  );
};

export default Sidebar;

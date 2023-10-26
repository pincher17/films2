import { SidebarContainerProps } from "@/components/Sidebar";
import styled from "styled-components";

export const SidebarContainer = styled.div<SidebarContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isopen }) => (isopen ? 'translateX(0)' : 'translateX(100%)')};
  overflow: scroll;
  background-color: rgb(0 0 0 / 80%);
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);
  background: rgb(21 21 21 / 83%);
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  color: #fff;
  padding-top: 105px;
  padding-left: 20px;
  padding-bottom: 150px;
`;

export const Title = styled.div`
  position: absolute;
  top: 30px;
  left: 20px;
  font-size: 28px;
  font-weight: bold;
`;

export const SidebarButton = styled.button`
  color: #fff;
  font-size: 18px;
  padding: 10px 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
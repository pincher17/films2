import styled from "styled-components";
import { SearchWrapperProps } from "../../components/AllBlur/AllBlur.types";

export const AllBlurDiv = styled.div<SearchWrapperProps>`
  display: ${({active}) => (active ? 'block' : 'none')};
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 140vw;
  height: 140vh;
  background-color: rgb(0 0 0 / 80%);
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);
  background: rgb(21 21 21 / 83%);
`;
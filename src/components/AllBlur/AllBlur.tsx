import React from "react";
import { AllBlurDiv } from "../../app/styles/AllBlur.styles";
import { useAppSelector } from "@/redux/hooks";

const AllBlur: React.FC = () => {
  const mobileSearch = useAppSelector((state) => state.search.mobileSearch);


  return (
    <AllBlurDiv active={(+mobileSearch)} />
  )
};

export default AllBlur;

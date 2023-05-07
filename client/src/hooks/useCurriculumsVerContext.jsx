import { CurriculumsVerContext } from "../context/CurriculumVerContext";
import { useContext } from "react";

export const useCurriculumsVerContext = () => {
  const context = useContext(CurriculumsVerContext);

  if (!context) {
    throw Error(
      "useCurriculumsContext must be used inside a CurriculumsVerContextProvider"
    );
  }

  return context;
};

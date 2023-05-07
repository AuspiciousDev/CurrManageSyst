import { CurriculumsContext } from "../context/CurriculumContext";
import { useContext } from "react";

export const useCurriculumsContext = () => {
  const context = useContext(CurriculumsContext);

  if (!context) {
    throw Error(
      "useCurriculumsContext must be used inside a InventoryContextProvider"
    );
  }

  return context;
};

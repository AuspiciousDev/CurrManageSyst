import { FeedbackContext } from "../context/FeedbackContext";
import { useContext } from "react";

export const useFeedbacksContext = () => {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw Error(
      "useFeedbacksContext must be used inside a FeedbackContextProvider"
    );
  }

  return context;
};

import React from "react";
import { createContext, useReducer } from "react";
export const CurriculumsContext = createContext();

export const curriculumsReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRICULUMS":
      return {
        curriculums: action.payload,
      };
    case "CREATE_CURRICULUM":
      return {
        curriculums: [action.payload, ...state.curriculums],
      };
    case "DELETE_CURRICULUM":
      return {
        curriculums: state.curriculums.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const CurriculumContextProvider = ({ children }) => {
  const [state, curriculumDispatch] = useReducer(curriculumsReducer, {
    curriculums: null,
  });

  return (
    <CurriculumsContext.Provider value={{ ...state, curriculumDispatch }}>
      {children}
    </CurriculumsContext.Provider>
  );
};

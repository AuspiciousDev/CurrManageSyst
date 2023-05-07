import React from "react";
import { createContext, useReducer } from "react";
export const CurriculumsVerContext = createContext();

export const curriculumsVerReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRICULUMSVERS":
      return {
        curriculumsVer: action.payload,
      };
    case "CREATE_CURRICULUMVER":
      return {
        curriculumsVer: [action.payload, ...state.curriculums],
      };
    case "DELETE_CURRICULUMVER":
      return {
        curriculumsVer: state.curriculumsVer.filter(
          (w) => w._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export const CurriculumVerContextProvider = ({ children }) => {
  const [state, curriculumVerDispatch] = useReducer(curriculumsVerReducer, {
    curriculums: null,
  });

  return (
    <CurriculumsVerContext.Provider value={{ ...state, curriculumVerDispatch }}>
      {children}
    </CurriculumsVerContext.Provider>
  );
};

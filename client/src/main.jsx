import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import { UsersContextProvider } from "./context/UserContext";
import { LoginsContextProvider } from "./context/LoginContext";
import { CurriculumContextProvider } from "./context/CurriculumContext.jsx";
import { CurriculumVerContextProvider } from "./context/CurriculumVerContext.jsx";
import { SubjectsContextProvider } from "./context/SubjectContext";
import { FeedbacksContextProvider } from "./context/FeedbackContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UsersContextProvider>
        <CurriculumContextProvider>
          <CurriculumVerContextProvider>
            <LoginsContextProvider>
              <SubjectsContextProvider>
                <FeedbacksContextProvider>
                  <App />
                </FeedbacksContextProvider>
              </SubjectsContextProvider>
            </LoginsContextProvider>
          </CurriculumVerContextProvider>
        </CurriculumContextProvider>
      </UsersContextProvider>
    </AuthProvider>
  </React.StrictMode>
);

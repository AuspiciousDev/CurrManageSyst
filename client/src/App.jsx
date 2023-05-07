import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import useAuth from "./hooks/useAuth";
// ! PUBLIC ROUTES
import NotFound404 from "./Pages/Public/NotFound404";
import Login from "./Pages/Public/Login";
import Unauthorized from "./Pages/Public/Unauthorized";

import ADMIN_Layout from "./Pages/admin/Layout/ADMIN_Layout";
import Dashboard from "./Pages/admin/Dashboard/Dashboard";
import Home from "./Pages/Public/Home";
import User from "./Pages/admin/User/User";
import UserCreate from "./Pages/admin/User/UserCreate";
import UserRecord from "./Pages/admin/User/UserRecord";
import UserRecordEdit from "./Pages/admin/User/UserRecordEdit";
import ChangePassword from "./Pages/admin/User/ChangePassword";
import Archive from "./Pages/admin/Archive/Archive";

import Curriculum from "./Pages/admin/Curriculum/Curriculum";
import AdminFeedback from "./Pages/admin/Feedback/Feedback";
import AdminFeedbackList from "./Pages/admin/Feedback/FeedbackList";
import AdminFeedCreate from "./Pages/admin/Feedback/FeedbackCreate";

import RequireAuth from "./Pages/auth/RequireAuth";
import PersistLogin from "./Pages/auth/PersistLogin";
import ForgotPassword from "./Pages/Public/ForgotPassword";
import ResetPassword from "./Pages/Public/ResetPassword";
import CurriculumCreate from "./Pages/admin/Curriculum/CurriculumCreate";
import CurriculumEdit from "./Pages/admin/Curriculum/CurriculumEdit";
import CurriculumList from "./Pages/admin/Curriculum/CurriculumList";
import CurriculumDetails from "./Pages/admin/Curriculum/CurriculumDetails";
import Subject from "./Pages/admin/Subjects/Subject";

import AdminReview from "./Pages/admin/Review/Review";

//!
import MEMBER_Layout from "./Pages/members/Layout/MEMBER_Layout";
import MemberDashboard from "./Pages/members/Dashboard/MemberDashboard";
import MemberCurriculum from "./Pages/members/Curriculum/MemberCurriculum";
import MemberCurriculumCreate from "./Pages/members/Curriculum/MemberCurriculumCreate";
import MemberCurriculumEdit from "./Pages/members/Curriculum/MemberCurriculumEdit";
import MemberCurriculumList from "./Pages/members/Curriculum/MemberCurriculumList";
import MemberCurriculumDetails from "./Pages/members/Curriculum/MemberCurriculumDetails";
import MemberSubject from "./Pages/members/Subjects/MemberSubject";
import MemberFeedback from "./Pages/members/Feedback/Feedback";
import MemberFeedbackList from "./Pages/admin/Feedback/FeedbackList";

import CHAIR_Layout from "./Pages/chairperson/Layout/CHAIR_Layout";
import ChairpersonDashboard from "./Pages/chairperson/Dashboard/ChairpersonDashboard";
import ChairCurriculum from "./Pages/chairperson/Curriculum/Curriculum";
import ChairCurriculumCreate from "./Pages/chairperson/Curriculum/CurriculumCreate";
import ChairCurriculumEdit from "./Pages/chairperson/Curriculum/CurriculumEdit";
import ChairCurriculumList from "./Pages/chairperson/Curriculum/CurriculumList";
import ChairCurriculumDetails from "./Pages/chairperson/Curriculum/CurriculumDetails";
import ChairFeedback from "./Pages/chairperson/Feedback/Feedback";
import ChairFeedbackList from "./Pages/chairperson/Feedback/FeedbackList";
import ChairFeedbackCreate from "./Pages/chairperson/Feedback/FeedbackCreate";
import ChairReview from "./Pages/chairperson/Review/Review";

import STAKE_Layout from "./Pages/stakeholder/Layout/STAKE_Layout";
import StakeholderDashboard from "./Pages/stakeholder/Dashboard/StakeholderDashboard";
import StakeCurriculum from "./Pages/stakeholder/Curriculum/Curriculum";
import StakeCurriculumList from "./Pages/stakeholder/Curriculum/CurriculumList";
import StakeCurriculumDetails from "./Pages/stakeholder/Curriculum/CurriculumDetails";
import StakeReview from "./Pages/stakeholder/Review/Review";

import StakeFeedback from "./Pages/stakeholder/Feedback/Feedback";
import StakeFeedbackList from "./Pages/stakeholder/Feedback/FeedbackList";
import StakeFeedbackCreate from "./Pages/stakeholder/Feedback/FeedbackCreate";
import GenerateCurriculum from "./Pages/admin/Generate/GenerateCurriculum";

const USER_TYPE = {
  DEAN: "admin",
  CHAIR: "comChair",
  MEMBER: "comMem",
  STAKEHOLDER: "stakeholder",
};

function App() {
  const [theme, colorMode] = useMode();
  const { auth, setAuth, persist, setPersist } = useAuth();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="auth/reset-password/:resetToken"
              element={<ResetPassword />}
            />
            {/* <Route path="unauthorized" element={<Unauthorized />} /> */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[USER_TYPE.DEAN]} />}>
                <Route path="/admin" element={<ADMIN_Layout />}>
                  <Route index element={<Dashboard />} />
                  //?? User
                  <Route path="users" element={<User />} />
                  <Route path="users/create" element={<UserCreate />} />
                  <Route
                    path="users/profile/:username"
                    element={<UserRecord />}
                  />
                  <Route
                    path="users/edit/:username"
                    element={<UserRecordEdit />}
                  />
                  <Route
                    path="users/changePassword"
                    element={<ChangePassword />}
                  />
                  //?? Record
                  <Route path="curriculums" element={<Curriculum />} />
                  <Route
                    path="curriculums/:currYear/:courseYear"
                    element={<CurriculumList />}
                  />
                  <Route
                    path="curriculums/:currYear/:courseYear/create"
                    element={<CurriculumCreate />}
                  />
                  <Route
                    path="curriculums/:currYear/:courseYear/:currVer"
                    element={<CurriculumDetails />}
                  />
                  <Route
                    path="curriculums/:currYear/:courseYear/:currVer/edit"
                    element={<CurriculumEdit />}
                  />
                  <Route path="subjects" element={<Subject />} />
                  <Route path="feedbacks" element={<AdminFeedback />} />
                  <Route
                    path="feedbacks/:currYear/:courseYear/:currVer/:currVerID/create"
                    element={<AdminFeedCreate />}
                  />
                  <Route
                    path="feedbacks/:currYear/:courseYear/:currVer/:currVerID"
                    element={<AdminFeedbackList />}
                  />
                  <Route
                    path="generate/:currVerID"
                    element={<GenerateCurriculum />}
                  />
                  <Route path="reviews" element={<AdminReview />} />
                  <Route path="archives" element={<Archive />} />
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={[USER_TYPE.CHAIR]} />}>
                <Route path="/chair" element={<CHAIR_Layout />}>
                  <Route index element={<ChairpersonDashboard />} />
                  <Route path="curriculums" element={<ChairCurriculum />} />
                  <Route
                    path="curriculums/:currYear/:courseYear"
                    element={<ChairCurriculumList />}
                  />
                  <Route
                    path="curriculums/:currYear/:courseYear/create"
                    element={<ChairCurriculumCreate />}
                  />
                  <Route
                    path="curriculums/:currYear/:courseYear/:currVer"
                    element={<ChairCurriculumDetails />}
                  />
                  <Route
                    path="curriculums/:currYear/:courseYear/:currVer/edit"
                    element={<ChairCurriculumEdit />}
                  />
                  <Route path="feedbacks" element={<ChairFeedback />} />
                  <Route
                    path="feedbacks/:currYear/:courseYear/:currVer"
                    element={<ChairFeedbackList />}
                  />
                  <Route
                    path="feedbacks/:currYear/:courseYear/:currVer/:currVerID/create"
                    element={<ChairFeedbackCreate />}
                  />
                  <Route path="subjects" element={<Subject />} />
                  <Route path="reviews" element={<ChairReview />} />{" "}
                  <Route
                    path="generate/:currVerID"
                    element={<GenerateCurriculum />}
                  />
                </Route>
              </Route>
              <Route
                element={<RequireAuth allowedRoles={[USER_TYPE.MEMBER]} />}
              >
                <Route path="/member" element={<MEMBER_Layout />}>
                  <Route index element={<MemberDashboard />} />
                  <Route path="curriculums" element={<MemberCurriculum />} />
                  <Route
                    path="curriculums/:currYear/:courseYear"
                    element={<MemberCurriculumList />}
                  />
                  Member
                  <Route
                    path="curriculums/:currYear/:courseYear/create"
                    element={<MemberCurriculumCreate />}
                  />
                  <Route
                    path="curriculums/:currYear/:courseYear/:currVer"
                    element={<MemberCurriculumDetails />}
                  />
                  <Route
                    path="curriculums/:currYear/:courseYear/:currVer/edit"
                    element={<MemberCurriculumEdit />}
                  />
                  <Route path="subjects" element={<MemberSubject />} />
                  <Route path="feedbacks" element={<MemberFeedback />} />
                  <Route
                    path="feedbacks/:currYear/:courseYear/:currVer/:currVerID"
                    element={<MemberFeedbackList />}
                  />
                  <Route path="users" element={<User />} />
                  <Route
                    path="users/profile/:username"
                    element={<UserRecord />}
                  />
                  <Route
                    path="users/edit/:username"
                    element={<UserRecordEdit />}
                  />
                  <Route
                    path="users/changePassword"
                    element={<ChangePassword />}
                  />{" "}
                  <Route
                    path="generate/:currVerID"
                    element={<GenerateCurriculum />}
                  />
                </Route>
              </Route>
              <Route
                element={<RequireAuth allowedRoles={[USER_TYPE.STAKEHOLDER]} />}
              >
                <Route path="/stakeholder" element={<STAKE_Layout />}>
                  <Route index element={<StakeholderDashboard />} />
                  <Route path="curriculums" element={<StakeCurriculum />} />
                  <Route
                    path="curriculums/:currYear/:courseYear"
                    element={<StakeCurriculumList />}
                  />
                  <Route
                    path="curriculums/:currYear/:courseYear/:currVer"
                    element={<StakeCurriculumDetails />}
                  />
                  <Route path="subjects" element={<MemberSubject />} />
                  <Route path="feedbacks" element={<StakeFeedback />} />
                  <Route
                    path="feedbacks/:currYear/:courseYear/:currVer/:currVerID/create"
                    element={<StakeFeedbackCreate />}
                  />
                  <Route
                    path="feedbacks/:currYear/:courseYear/:currVer/:currVerID"
                    element={<StakeFeedbackList />}
                  />
                  <Route
                    path="users/profile/:username"
                    element={<UserRecord />}
                  />
                  <Route
                    path="users/edit/:username"
                    element={<UserRecordEdit />}
                  />
                  <Route
                    path="users/changePassword"
                    element={<ChangePassword />}
                  />
                  <Route path="reviews" element={<StakeReview />} />{" "}
                  <Route
                    path="generate/:currVerID"
                    element={<GenerateCurriculum />}
                  />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

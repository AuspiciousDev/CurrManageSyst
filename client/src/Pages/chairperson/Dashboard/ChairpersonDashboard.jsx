import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Avatar,
  Button,
  ButtonBase,
} from "@mui/material";
import { format } from "date-fns-tz";
import React from "react";
import { tokens } from "../../../theme";
import Paper_Totals from "../../../components/Dashboard/Paper_Totals";
import {
  Person2Outlined,
  DvrOutlined,
  MoveToInboxOutlined,
  DescriptionOutlined,
  CheckCircle,
  Cancel,
  AccessTime,
  QrCodeScanner,
  ArchiveOutlined,
  GroupAddOutlined,
  GroupsOutlined,
  BookOutlined,
  PendingActionsOutlined,
  AvTimerOutlined,
  DrawOutlined,
} from "@mui/icons-material";

import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import WelcomeDialogue from "../../../global/WelcomeDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useUsersContext } from "../../../hooks/useUserContext";
import { useLoginsContext } from "../../../hooks/useLoginContext";
import Paper_Status from "../../../components/global/Paper_Status";
import Paper_CurrStatus from "../../../components/global/Paper_CurrStatus";
import { useCurriculumsContext } from "../../../hooks/useCurriculumsContext";
import { useCurriculumsVerContext } from "../../../hooks/useCurriculumsVerContext";
import { useFeedbacksContext } from "../../../hooks/useFeedbackContext";
import { useSubjectsContext } from "../../../hooks/useSubjectContext";

const ChairpersonDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { users, userDispatch } = useUsersContext();
  const { logins, loginDispatch } = useLoginsContext();
  const { curriculums, curriculumDispatch } = useCurriculumsContext();
  const { curriculumsVer, curriculumVerDispatch } = useCurriculumsVerContext();
  const { subjects, subDispatch } = useSubjectsContext();
  const { feedbacks, feedDispatch } = useFeedbacksContext();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [welcomeDialog, setWelcomeDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("newLogin"));
    if (items) {
      setWelcomeDialog({
        isOpen: true,
        message: `Welcome,  `,
        type: `${auth.userType}`,
      });
      localStorage.setItem("newLogin", false);
    }
  }, []);

  useEffect(() => {
    const getOverviewDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const apiUsers = await axiosPrivate.get("/api/user");
        const apiLogins = await axiosPrivate.get("/api/loginHistory");
        const apiCurriculum = await axiosPrivate.get("/api/curriculum/");
        const apiCurriculumVer = await axiosPrivate.get("/api/curriculumVer/");
        const apiSubject = await axiosPrivate.get("/api/subject/");
        const apiFeedback = await axiosPrivate.get("/api/feedback/");

        if (apiUsers.status === 200) {
          const json = await apiUsers.data;
          console.log(json);
          userDispatch({ type: "SET_USERS", payload: json });
        }
        if (apiCurriculumVer.status === 200) {
          const json = await apiCurriculumVer.data;
          console.log(json);
          curriculumVerDispatch({ type: "SET_CURRICULUMSVERS", payload: json });
        }
        if (apiLogins.status === 200) {
          const json = await apiLogins.data;
          console.log(
            "🚀 ~ file: Dashboard.jsx:105 ~ getOverviewDetails ~ json",
            json
          );
          loginDispatch({ type: "SET_LOGINS", payload: json });
        }
        if (apiCurriculum.status === 200) {
          const json = await apiCurriculum.data;
          console.log(json);
          curriculumDispatch({ type: "SET_CURRICULUMS", payload: json });
        }
        if (apiFeedback.status === 200) {
          const json = await apiFeedback.data;
          console.log(json);
          feedDispatch({ type: "SET_FEEDBACKS", payload: json });
        }
        if (apiSubject.status === 200) {
          const json = await apiSubject.data;
          console.log(json);
          subDispatch({ type: "SET_SUBJECTS", payload: json });
        }

        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: Dashboard.jsx:91 ~ getOverviewDetails ~ error",
          error
        );
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          // setErrorDialog({
          //   isOpen: true,
          //   message: `${error.response.data.message}`,
          // });
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 500) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
        }
      }
    };
    getOverviewDetails();
  }, []);
  const getCurrVerIDValue = (val, num) => {
    var arr = val.split("_");
    return arr[num];
  };

  const tableDetails = ({ val }) => {
    return (
      <TableRow key={val.currVerID}>
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }} gap={2}>
            <Link
              to={`/chair/curriculums/${getCurrVerIDValue(
                val?.currVerID,
                1
              )}/${getCurrVerIDValue(val?.currVerID, 0)}/${val?.currVer}`}
              style={{
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Paper
                sx={{
                  padding: "2px 20px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: colors.whiteOnly[500],
                  alignItems: "center",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ color: colors.blackOnly[500] }}
                >
                  {val?.currVer}
                </Typography>
              </Paper>
            </Link>
          </Box>
        </TableCell>

        <TableCell align="center" sx={{ textTransform: "uppercase" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }} gap={2}>
            <Link
              to={`/chair/curriculums/${getCurrVerIDValue(
                val?.currVerID,
                1
              )}/${getCurrVerIDValue(val?.currVerID, 0)}`}
              style={{
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Paper
                sx={{
                  padding: "2px 20px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: colors.whiteOnly[500],
                  alignItems: "center",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ color: colors.blackOnly[500] }}
                >
                  {getCurrVerIDValue(val?.currVerID, 1)}
                </Typography>
              </Paper>
            </Link>
          </Box>
        </TableCell>
        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
          {format(new Date(val.createdAt), "MMMM dd, yyyy")}
        </TableCell>
        <TableCell align="center">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ButtonBase disabled>
              {val?.status === "chairReview" ? (
                <Paper_CurrStatus
                  icon={<AvTimerOutlined />}
                  title={"Chair Review"}
                  type={`${val?.status}`}
                />
              ) : val?.status === "stakeReview" ? (
                <Paper_CurrStatus
                  icon={<CheckCircle />}
                  title={"Stake Review"}
                  action={"approve"}
                  type={`${val?.status}`}
                />
              ) : val?.status === "deanReview" ? (
                <Paper_CurrStatus
                  icon={<CheckCircle />}
                  title={"Dean Review"}
                  type={`${val?.status}`}
                />
              ) : val?.status === "approved" ? (
                <Paper_CurrStatus
                  icon={<CheckCircle />}
                  title={"approved"}
                  type={`${val?.status}`}
                />
              ) : val?.status === "denied" ? (
                <Paper_CurrStatus
                  icon={<CheckCircle />}
                  title={"denied"}
                  type={`${val?.status}`}
                />
              ) : val?.status === "ongoing" ? (
                <Paper_CurrStatus
                  icon={<DrawOutlined />}
                  title={"ongoing"}
                  type={`${val?.status}`}
                />
              ) : (
                <Paper_CurrStatus
                  icon={<PendingActionsOutlined />}
                  title={"pending"}
                  type={`${val?.status}`}
                />
              )}
            </ButtonBase>
          </Box>
        </TableCell>
      </TableRow>
    );
  };
  return (
    <Box className="container-layout_body_contents">
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <WelcomeDialogue
        welcomeDialog={welcomeDialog}
        setWelcomeDialog={setWelcomeDialog}
      />
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          margin: "0 0 10px 0",
          padding: { xs: "10px", sm: "0 10px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: { sm: "end" },
              justifyContent: { xs: "center", sm: "start" },
              m: { xs: "20px 0" },
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                borderLeft: `5px solid ${colors.primary[500]}`,
                paddingLeft: 2,
              }}
            >
              DASHBOARD
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "2fr 2fr 2fr 2fr" },
          margin: "1em 0em",
        }}
        gap={2}
      >
        <Paper_Totals
          to={"reviews"}
          value={
            curriculumsVer
              ? curriculumsVer.filter((filter) => {
                  return filter?.status === "chairReview";
                }).length
              : 0
          }
          icon={<PendingActionsOutlined />}
          description="Pending Reviews"
        />
        <Paper_Totals
          to={"Curriculum"}
          value={curriculums ? curriculums.length : "0"}
          icon={<DescriptionOutlined />}
          description="Total Number of Curriculums"
        />
        <Paper_Totals
          to={"subject"}
          value={subjects ? subjects.length : "0"}
          icon={<BookOutlined />}
          description="Total Number of Subject"
        />

        <Paper_Totals
          to={"users"}
          value={
            users
              ? users.filter((filter) => {
                  return filter.status === true;
                }).length
              : "0"
          }
          icon={<GroupsOutlined />}
          description="Total Number of Active Users"
        />
      </Box>
      <Box height="100%">
        <Box
          sx={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "6fr 2fr" },
          }}
        >
          <Paper elevation={2} sx={{ position: "relative", p: 2 }}>
            <Typography
              variant="h4"
              mb={1}
              sx={{
                borderLeft: `5px solid ${colors.primary[500]}`,
                paddingLeft: 2,
              }}
            >
              Recent Curriculums
            </Typography>
            <Divider sx={{ mt: 2 }} />
            <TableContainer>
              <Table sx={{ minWidth: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Version</TableCell>
                    <TableCell align="center">Course Year</TableCell>
                    <TableCell align="center">Date Created</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {curriculumsVer &&
                    curriculumsVer.map((val) => {
                      return val && tableDetails({ val });
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <TablePagination
              sx={{
                position: { xs: "", sm: "absolute" },
                bottom: 1,
                right: 1,
              }}
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={
                curriculumsVer
                  ? curriculumsVer.filter((filter) => {
                      return filter?.status !== "archived";
                    }).length
                  : 0
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "100%",
              mt: { xs: 2, sm: 0 },
              ml: { xs: 0, sm: 2 },
              padding: { xs: "20px 0 20px 0", sm: 2 },
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Typography
                variant="h4"
                mb={1}
                sx={{
                  borderLeft: `5px solid ${colors.primary[500]}`,
                  paddingLeft: 2,
                }}
              >
                Recent Logins
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  mt: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 1,
                }}
              >
                {logins &&
                  logins
                    .slice(0, 6)
                    .filter((filter) => {
                      return filter.username === auth.username;
                    })
                    .map((val, key) => (
                      <Paper
                        key={key}
                        elevation={2}
                        sx={{
                          height: "100%",
                          color: `${colors.black[100]}`,
                          display: "flex",
                          flexDirection: "row",
                          padding: "10px",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            alt="profile-user"
                            sx={{ width: "35px", height: "35px" }}
                            src={val.imgURL}
                            style={{
                              marginRight: "15px",
                              objectFit: "contain",
                              borderRadius: "50%",
                            }}
                          />
                          <Box>
                            <Typography textTransform="capitalize">
                              {val.username}
                            </Typography>
                            <Typography textTransform="capitalize">
                              {format(new Date(val.createdAt), "hh:mm a, EEEE")}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ChairpersonDashboard;

import React, { useEffect, useState } from "react";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import DecisionDialogue from "../../../global/DecisionDialogue";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Divider,
  ButtonBase,
  useTheme,
  Avatar,
  TextField,
} from "@mui/material";
import {
  Delete,
  CheckCircle,
  Cancel,
  Add,
  Search,
  DeleteOutline,
  AccessTime,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import Paper_Status from "../../../components/global/Paper_Status";
import Paper_Icon from "../../../components/global/Paper_Icon";
import { format } from "date-fns-tz";
import { useFeedbacksContext } from "../../../hooks/useFeedbackContext";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar />
    </GridToolbarContainer>
  );
}
const AdminFeedCreate = () => {
  const { currYear, courseYear, currVer, currVerID } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { feedbacks, feedDispatch } = useFeedbacksContext();

  const [feedbackMessage, setFeedbackMessage] = React.useState("");
  const [page, setPage] = React.useState(15);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [decisionDialog, setDecisionDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [validateDialog, setValidateDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    const doc = {
      feedbackMessage,
      createdBy: auth?.username,
      currVerID: currVerID,
    };
    try {
      const response = await axiosPrivate.post(
        "/api/feedback/create",
        JSON.stringify(doc)
      );
      if (response.status === 201) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: `Feedback has be sent for curriculum version ${currVerID}`,
        });
        setFeedbackMessage("");
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log(
        "🚀 ~ file: UserCreate.jsx:105 ~ handleSubmit ~ error",
        error
      );
      setLoadingDialog({ isOpen: false });
      const errMessage = error.response.data.message;
      console.log(
        "🚀 ~ file: UserCreate.jsx:127 ~ handleSubmit ~ errMessage:",
        errMessage
      );
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        console.log(errMessage);
      } else {
        console.log(error);
        console.log(error.response);
      }
    }
  };
  return (
    <Box className="container-layout_body_contents">
      <ConfirmDialogue
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <ValidateDialogue
        validateDialog={validateDialog}
        setValidateDialog={setValidateDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <DecisionDialogue
        decisionDialog={decisionDialog}
        setDecisionDialog={setDecisionDialog}
      />

      <Paper
        elevation={2}
        sx={{
          width: "100%",
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
                textTransform: "uppercase",
              }}
            >
              Feedbacks &#62; {currYear} &#62; {courseYear + " Year"} &#62;{" "}
              {currVer} &#62; create
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          mt: 2,
          p: 2,
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Typography variant="h3">Feedback</Typography>
          <TextField
            sx={{ textAlign: "left", width: "100%", mt: 1 }}
            autoComplete="off"
            variant="outlined"
            placeholder="Write some message..."
            multiline
            rows={5}
            required
            value={feedbackMessage}
            onChange={(e) => {
              setFeedbackMessage(e.target.value);
            }}
          />
          <Box
            display="flex"
            sx={{ justifyContent: { xs: "center", sm: "end" }, mt: 3 }}
            height="70px"
            gap={2}
          >
            <Button
              type="button"
              variant="contained"
              color="secondary"
              sx={{ width: "250px", height: "50px" }}
              onClick={() => {
                setFeedbackMessage("");
              }}
            >
              <Typography variant="h5">clear</Typography>
            </Button>
            <Button
              type="submit"
              // disabled={emailError || dateOfBirthError}
              variant="contained"
              sx={{ width: "250px", height: "50px" }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                submit
              </Typography>
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminFeedCreate;

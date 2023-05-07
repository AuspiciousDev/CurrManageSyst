import React, { useEffect } from "react";
import { useState } from "react";
import { FormControl, InputLabel, MenuItem, useTheme } from "@mui/material";
import { tokens } from "../theme";
import axios from "../api/axios";
import ErrorDialogue from "./ErrorDialogue";
import LoadingDialogue from "./LoadingDialogue";
import SuccessDialogue from "./SuccessDialogue";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Box,
  ClickAwayListener,
  TextField,
  InputAdornment,
  IconButton,
  Select,
} from "@mui/material";
import {
  PrivacyTipOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  PersonOutline,
} from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
const VERIFY_URL = "/api/curriculum/create";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { format } from "date-fns-tz";
import { useCurriculumsContext } from "../hooks/useCurriculumsContext";
const CreateCurrDialogue = (props) => {
  const { auth } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const location = useLocation();
  const [courseYear, setCourseYear] = useState("");
  const [currYear, setCurrYear] = useState("");
  const [currYearError, setCurrYearError] = useState(false);
  const [courseYearError, setCourseYearError] = useState(false);
  const handleDate = (newValue) => {
    setCurrYear(format(new Date(newValue), "yyyy"));
    setCurrYearError(false);
    setCourseYearError(false);
  };
  const { curriculums, curriculumDispatch } = useCurriculumsContext();

  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const { createCurrDialogue, setCreateCurrDialogue } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return (
        setCourseYear(""),
        setCurrYear(""),
        setCourseYearError(false),
        setCurrYearError(false),
        setCreateCurrDialogue({ ...createCurrDialogue, isOpen: false })
      );
  };
  const handleClose2 = (event, reason) => {
    return (
      setCourseYear(""),
      setCurrYear(""),
      setCourseYearError(false),
      setCurrYearError(false),
      setCreateCurrDialogue({ ...createCurrDialogue, isOpen: false })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });

    const doc = { currYear, createdBy: auth.username, courseYear };
    if (!currYearError || !courseYearError) {
      try {
        console.log(currYear + " " + courseYear);
        const response = await axios.post(VERIFY_URL, doc, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.status === 201) {
          const json = await response.data;
          console.log(response.data.message);
          createCurrDialogue.onConfirm();
          curriculumDispatch({ type: "CREATE_CURRICULUM", payload: json });
          setCreateCurrDialogue({ isOpen: false });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        console.log(error);
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 401) {
          setPasswordError(true);
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
          setCurrYearError(true);
          setCourseYearError(true);
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
    }
  };

  return (
    <>
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <Dialog
        sx={{ textAlign: "center" }}
        open={createCurrDialogue.isOpen}
        onClose={handleClose}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* <Typography>Confirm Alert</Typography> */}

          <DialogTitle sx={{ margin: "0 30px" }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {/* <Typography>Confirm Alert</Typography> */}
              <PrivacyTipOutlined
                sx={{ fontSize: "100px", color: colors.secondary[500] }}
              />
              <Typography variant="h3">New Curriculum</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ margin: "0 20px" }}>
            <Typography variant="h4">{createCurrDialogue.title}</Typography>
            <Typography variant="h5">{createCurrDialogue.message}</Typography>
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2} sx={{ m: 2 }}>
                <FormControl required fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Course Year
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={courseYear}
                    label="Course Year"
                    onChange={(e) => {
                      setCourseYear(e.target.value);
                      setCurrYearError(false);
                      setCourseYearError(false);
                    }}
                    sx={{ textAlign: "left" }}
                    error={courseYearError}
                  >
                    <MenuItem value={"1st"}>First Year</MenuItem>
                    <MenuItem value={"2nd"}>Second Year</MenuItem>
                    <MenuItem value={"3rd"}>Third Year</MenuItem>
                    <MenuItem value={"4th"}>Fourth Year</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    views={["year"]}
                    label="Curriculum Year"
                    inputFormat="YYYY"
                    value={currYear}
                    onChange={handleDate}
                    renderInput={(params) => (
                      <TextField
                        autoComplete="off"
                        disabled
                        {...params}
                        error={currYearError}
                      />
                    )}
                  />
                </LocalizationProvider>
                <DialogActions
                  sx={{
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleClose2}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    disabled={
                      !courseYear ||
                      !currYear ||
                      courseYearError ||
                      currYearError
                    }
                    variant="contained"
                    type="submit"
                    sx={{ color: "white" }}
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Box>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default CreateCurrDialogue;

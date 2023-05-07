import React, { useEffect } from "react";
import { useState } from "react";
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
  Autocomplete,
  Box,
  ButtonBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  PrivacyTipOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  PersonOutline,
  BookOutlined,
} from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
const VERIFY_URL = "/api/subject/create";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { format } from "date-fns-tz";
import { useCurriculumsContext } from "../hooks/useCurriculumsContext";
import { useSubjectsContext } from "../hooks/useSubjectContext";
const CreateSubjectDialogue = (props) => {
  const { auth } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const location = useLocation();
  const [subjectCode, setSubjectCode] = useState("");
  const [descTitle, setDescTitle] = useState("");
  const [courseYear, setCourseYear] = useState("");
  const [courseTerm, setCourseTerm] = useState("");

  const [lecUnits, setLecUnits] = useState();
  const [labUnits, setLabUnits] = useState();
  const [hoursPerWeek, setHoursPerWeek] = useState();

  const [preReq, setPreReq] = useState([]);
  const [coReq, setCoReq] = useState([]);

  const [subjectCodeError, setSubjectCodeError] = useState(false);
  const [courseYearError, setCourseYearError] = useState(false);
  const { subjects, subDispatch } = useSubjectsContext();

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

  const { createSubjectDialogue, setCreateSubjectDialogue } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return (
        clearItems(),
        setCreateSubjectDialogue({ ...createSubjectDialogue, isOpen: false })
      );
  };
  const handleClose2 = (event, reason) => {
    return (
      clearItems(),
      setCreateSubjectDialogue({ ...createSubjectDialogue, isOpen: false })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });

    const doc = {
      subjectCode,
      descTitle,
      createdBy: auth.username,
      courseYear,
      lecUnits,
      labUnits,
      hoursPerWeek,
      preReq,
      coReq,
      courseTerm,
    };
    if (!subjectCodeError) {
      try {
        const response = await axios.post(VERIFY_URL, doc, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.status === 201) {
          const json = await response.data;
          console.log(response.data.message);
          createSubjectDialogue.onConfirm();
          subDispatch({ type: "CREATE_SUBJECT", payload: json });
          setCreateSubjectDialogue({ isOpen: false });
          clearItems();
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
          setSubjectCodeError(true);
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

  const clearItems = () => {
    setCourseYear("");
    setSubjectCode("");
    setDescTitle("");
    setCourseYear("");
    setCourseTerm("");
    setLecUnits("");
    setLabUnits("");
    setHoursPerWeek("");
    setPreReq([]);
    setCoReq([]);
    setSubjectCodeError(false);
    setCourseYearError(false);
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
        open={createSubjectDialogue.isOpen}
        onClose={handleClose}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* <Typography>Confirm Alert</Typography> */}

          <DialogTitle>
            <Box display="flex" flexDirection="column" alignItems="center">
              {/* <Typography>Confirm Alert</Typography> */}
              <BookOutlined
                sx={{ fontSize: "100px", color: colors.primary[500] }}
              />
              <Typography variant="h3">Create Subject</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ margin: "0 20px" }}>
            <Typography variant="h4">{createSubjectDialogue.title}</Typography>
            <Typography variant="h5">
              {createSubjectDialogue.message}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{ m: 2, width: "400px" }}
              >
                <TextField
                  required
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                  label="Subject Code"
                  placeholder="ex. IT 102"
                  error={subjectCodeError}
                  value={subjectCode}
                  onChange={(e) => {
                    setSubjectCode(e.target.value.trim());
                    setSubjectCodeError(false);
                    setCourseYearError(false);
                  }}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                />
                <TextField
                  required
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                  label="Descriptive Title"
                  placeholder="ex. Introduction to Computing"
                  value={descTitle}
                  onChange={(e) => {
                    setDescTitle(e.target.value);
                  }}
                  inputProps={{ style: { textTransform: "capitalize" } }}
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <FormControl size="small" required fullWidth>
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
                        setCourseYearError(false);
                      }}
                      sx={{ textAlign: "left" }}
                      error={courseYearError}
                    >
                      <MenuItem value={"1st"}>1st Year</MenuItem>
                      <MenuItem value={"2nd"}>2nd Year</MenuItem>
                      <MenuItem value={"3rd"}>3rd Year</MenuItem>
                      <MenuItem value={"4th"}>4th Year</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" required fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Hours per week
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={hoursPerWeek}
                      label="Hours per week"
                      onChange={(e) => {
                        setHoursPerWeek(e.target.value);
                      }}
                      sx={{ textAlign: "left" }}
                    >
                      <MenuItem value={"1"}>1</MenuItem>
                      <MenuItem value={"2"}>2</MenuItem>
                      <MenuItem value={"3"}>3</MenuItem>
                      <MenuItem value={"4"}>4</MenuItem>
                      <MenuItem value={"5"}>5</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" required fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Lecture Units
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={lecUnits}
                      label="Lecture Units"
                      onChange={(e) => {
                        setLecUnits(e.target.value);
                      }}
                      sx={{ textAlign: "left" }}
                    >
                      <MenuItem value={"0"}>0</MenuItem>
                      <MenuItem value={"1"}>1.0</MenuItem>
                      <MenuItem value={"2"}>2.0</MenuItem>
                      <MenuItem value={"3"}>3.0</MenuItem>
                      <MenuItem value={"4"}>4.0</MenuItem>
                      <MenuItem value={"5"}>5.0</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" required fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Lab Units
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={labUnits}
                      label="Lab Units"
                      onChange={(e) => {
                        setLabUnits(e.target.value);
                      }}
                      sx={{ textAlign: "left" }}
                    >
                      <MenuItem value={"0"}>0</MenuItem>
                      <MenuItem value={"1"}>1.0</MenuItem>
                      <MenuItem value={"2"}>2.0</MenuItem>
                      <MenuItem value={"3"}>3.0</MenuItem>
                      <MenuItem value={"4"}>4.0</MenuItem>
                      <MenuItem value={"5"}>5.0</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <FormControl size="small" required fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Course Term
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={courseTerm}
                    label="Course Term"
                    onChange={(e) => {
                      setCourseTerm(e.target.value);
                    }}
                    sx={{ textAlign: "left" }}
                  >
                    <MenuItem value={"1st"}>1st Term</MenuItem>
                    <MenuItem value={"2nd"}>2nd Term</MenuItem>
                  </Select>
                </FormControl>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={preReq}
                  onChange={(event, newValue) => {
                    setPreReq(newValue);
                  }}
                  multiple
                  options={
                    subjects && subjects.map((option) => option.subjectCode)
                  }
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    preReq.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Pre req"
                      placeholder="Search"
                    />
                  )}
                />

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={coReq}
                  onChange={(event, newValue) => {
                    setCoReq(newValue);
                  }}
                  multiple
                  options={
                    subjects && subjects.map((option) => option.subjectCode)
                  }
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    preReq.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Co req"
                      placeholder="Search"
                    />
                  )}
                />
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
                      !descTitle ||
                      !subjectCode ||
                      !labUnits ||
                      !lecUnits ||
                      !hoursPerWeek ||
                      courseYearError ||
                      subjectCodeError
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

export default CreateSubjectDialogue;

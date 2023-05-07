import React, { useEffect, useState } from "react";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import {
  Autocomplete,
  Box,
  Button,
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
  Delete,
  CheckCircle,
  Cancel,
  Add,
  Search,
  DeleteOutline,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useUsersContext } from "../../../hooks/useUserContext";
import { styled } from "@mui/material/styles";
import { useSubjectsContext } from "../../../hooks/useSubjectContext";
const ChairCurriculumEdit = () => {
  const { courseYear, currYear, currVer } = useParams();
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { subjects, subDispatch } = useSubjectsContext();
  const [currVerDetails, setCurrVerDetails] = useState([]);
  const [subjectCode, setSubjectCode] = useState("");
  const [descTitle, setDescTitle] = useState("");
  const [term, setTerm] = useState("");
  const [lecUnits, setLecUnits] = useState("");
  const [labUnits, setLabUnits] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [preReq, setPreReq] = useState([]);
  const [coReq, setCoReq] = useState([]);

  const [term1, setTerm1] = useState([]);
  const [term2, setTerm2] = useState([]);

  const [subjectCodeError, setSubjectCodeError] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
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

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });

        const response = await axiosPrivate.get(
          `/api/curriculumVer/version/${
            courseYear + "_" + currYear + "_" + currVer
          }`
        );
        if (response.status === 200) {
          const json = await response.data;
          console.log(
            "🚀 ~ file: CurriculumEdit.jsx:106 ~ getUsersDetails ~ json:",
            json[0]
          );
          console.log(
            "🚀 ~ file: CurriculumEdit.jsx:110 ~ getUsersDetails ~ json:",
            json[0].term1.courses
          );
          setTerm1(json[0].term1.courses);
          setTerm2(json[0].term2.courses);

          setCurrVerDetails(json[0]);
        }
        const apiSubject = await axiosPrivate.get("/api/subject/");
        if (apiSubject.status === 200) {
          const json = await apiSubject.data;
          console.log(json);
          subDispatch({ type: "SET_SUBJECTS", payload: json });
        }
        setLoadingDialog({ isOpen: false });

        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: User.jsx:90 ~ getUsersDetails ~ error", error);
        setLoadingDialog({ isOpen: false });
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
        } else if (error.response.status === 404) {
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
          console.log(error);
        }
      }
    };
    getUsersDetails();
  }, []);
  const handleCreate = async (e) => {
    const doc = {
      courseYear,
      currYear,
      currVer,
      createdBy: currVerDetails.createdBy,
      updatedBy: auth.username,
      term1,
      term2,
    };
    console.log(
      "🚀 ~ file: CurriculumCreate.jsx:214 ~ handleCreate ~ doc:",
      doc
    );

    try {
      const response = await axiosPrivate.post(
        "/api/curriculumVer/create",
        JSON.stringify(doc)
      );
      if (response.status === 201) {
        const json = await response.data;
        console.log(json);
        clearItems();
        clearFields();
        setSuccessDialog({
          isOpen: true,
          message: `New curriculum version has been saved!`,
        });
      }
    } catch (error) {
      console.log("🚀 ~ file: User.jsx:90 ~ getUsersDetails ~ error", error);
      setLoadingDialog({ isOpen: false });
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
        console.log(error);
      }
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    let existingItem;
    const value = {
      subjectCode,
      descTitle,
      lecUnits,
      labUnits,
      totalUnits: Number(lecUnits) + Number(labUnits),
      hoursPerWeek,
      preReq,
      coReq,
    };

    console.log(
      "🚀 ~ file: CurriculumCreate.jsx:216 ~ handleAddItem ~ value:",
      value
    );

    if (term === "1st")
      existingItem = term1?.find((item) => {
        return item.subjectCode === value.subjectCode;
      });
    if (term === "2nd")
      existingItem = term2?.find((item) => {
        return item.subjectCode === value.subjectCode;
      });

    if (existingItem) {
      existingItem.subjectCode = value.subjectCode;
      existingItem.descTitle = value.descTitle;
      existingItem.lecUnits = value.lecUnits;
      existingItem.labUnits = value.labUnits;
      existingItem.totalUnits = value.totalUnits;
      existingItem.hoursPerWeek = value.hoursPerWeek;
      existingItem.preReq = value.preReq;
      existingItem.coReq = value.coReq;
    } else {
      if (term === "1st") value && setTerm1((arr) => [...arr, value]);
      if (term === "2nd") value && setTerm2((arr) => [...arr, value]);
    }
    clearItems();
  };
  const clearFields = () => {
    setTerm1([]);
    setTerm2([]);
  };
  const handleRowClickRow1 = async (val) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure to remove ${val.subjectCode}?`,
      onConfirm: () => {
        handleRemoveRow1(val.subjectCode);
      },
    });
  };
  const handleRemoveRow1 = async (value) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newItems = term1.filter((val) => val.subjectCode != value);
    setTerm1(newItems);
  };
  const handleRowClickRow2 = async (val) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure to remove ${val.subjectCode}?`,
      onConfirm: () => {
        handleRemoveRow2(val.subjectCode);
      },
    });
  };
  const handleRemoveRow2 = async (value) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newItems = term2.filter((val) => val.subjectCode != value);
    setTerm2(newItems);
  };

  const handleRowTerm1Edit = (rTerm, val) => {
    setTerm(rTerm);
    setSubjectCode(val?.subjectCode);
    setDescTitle(val?.descTitle);
    setLecUnits(val?.lecUnits);
    setLabUnits(val?.labUnits);
    setHoursPerWeek(val?.hoursPerWeek);
    setPreReq(val?.preReq);
    setCoReq(val?.coReq);
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      // backgroundColor: "#ccd2d8",
    },
    // hide last border
    " & th": {
      // border: "1px solid #000",
    },
  }));
  const TableTitles = () => {
    return (
      <StyledTableRow
        sx={{
          height: "30px",
          "& > th": {
            textTransform: "uppercase",
            fontWeight: 600,
            color: "black",
          },
        }}
      >
        <TableCell align="center">SUBJECT CODE </TableCell>
        <TableCell align="center">DESCRIPTIVE TITLE</TableCell>
        <TableCell align="center">Lec Units </TableCell>
        <TableCell align="center">Lab Units </TableCell>
        <TableCell align="center">Total Units </TableCell>
        <TableCell align="center">Hours per Week </TableCell>
        <TableCell align="center">Pre-req. </TableCell>
        <TableCell align="center">Co-REQ. </TableCell>
        <TableCell align="center">Action</TableCell>
      </StyledTableRow>
    );
  };
  const SubTable = ({ yearTitle }) => {
    return (
      <>
        {/* //?? 1st Term */}
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={9}
              align="center"
              sx={{
                fontSize: "19pt",
                textTransform: "uppercase !important",
                backgroundColor: `${colors.secondary[500]}`,
                fontWeight: 600,
                color: "black",
                p: 1,
              }}
            >
              {yearTitle}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={9}
              sx={{
                backgroundColor: `${colors.secondary[200]}`,
                fontSize: "12pt",
                textTransform: "uppercase !important",
                fontWeight: 600,
                color: "black",
              }}
            >
              1st term
            </TableCell>
          </TableRow>

          <TableTitles key={"asdas"} />
        </TableHead>
        <TableBody>
          {term1 &&
            term1?.map((val, key) => {
              return (
                <TableRow
                  sx={{
                    "& > td ": {
                      textTransform: "capitalize",
                      fontSize: "12pt",
                      color: "black",
                    },
                  }}
                  key={key}
                  onClick={() => handleRowTerm1Edit("1st", val)}
                >
                  <TableCell
                    align="center"
                    sx={{ textTransform: "uppercase !important" }}
                  >
                    {val?.subjectCode}
                  </TableCell>
                  <TableCell align="center">{val?.descTitle}</TableCell>
                  <TableCell align="center">{val?.lecUnits}</TableCell>
                  <TableCell align="center">{val?.labUnits}</TableCell>
                  <TableCell align="center">{val?.totalUnits}</TableCell>
                  <TableCell align="center">{val?.hoursPerWeek}</TableCell>
                  <TableCell sx={{ textTransform: "uppercase" }} align="center">
                    {val?.preReq?.map((val, key) => {
                      return (key ? ", " : "") + val.toUpperCase();
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {val?.coReq?.map((val, key) => {
                      return (key ? ", " : "") + val;
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <ButtonBase
                      onClick={() => {
                        handleRowClickRow1(val);
                      }}
                    >
                      <Paper
                        sx={{
                          padding: "2px 10px",
                          borderRadius: "20px",
                          display: "flex",
                          justifyContent: "center",
                          backgroundColor: colors.redDark[500],
                          color: colors.whiteOnly[500],
                          alignItems: "center",
                        }}
                      >
                        <Delete />
                        <Typography ml="5px">Remove</Typography>
                      </Paper>
                    </ButtonBase>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
        {/* //?? 2nd Term */}
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={9}
              sx={{
                backgroundColor: `${colors.secondary[200]}`,
                fontSize: "12pt",
                textTransform: "uppercase !important",
                fontWeight: 600,
                color: "black",
              }}
            >
              2nd term
            </TableCell>
          </TableRow>
          <TableTitles key={"asdas"} />
        </TableHead>
        <TableBody>
          {term2 &&
            term2?.map((val, key) => {
              return (
                <TableRow
                  sx={{
                    "& > td ": {
                      textTransform: "capitalize",
                      fontSize: "12pt",
                      color: "black",
                    },
                  }}
                  key={key}
                  onClick={() => handleRowTerm1Edit("2nd", val)}
                >
                  <TableCell
                    align="center"
                    sx={{ textTransform: "uppercase !important" }}
                  >
                    {val?.subjectCode}
                  </TableCell>
                  <TableCell align="center">{val?.descTitle}</TableCell>
                  <TableCell align="center">{val?.lecUnits}</TableCell>
                  <TableCell align="center">{val?.labUnits}</TableCell>
                  <TableCell align="center">{val?.totalUnits}</TableCell>
                  <TableCell align="center">{val?.hoursPerWeek}</TableCell>
                  <TableCell align="center">
                    {val?.preReq?.map((val, key) => {
                      return (key ? ", " : "") + val.toUpperCase();
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {val?.coReq?.map((val, key) => {
                      return (key ? ", " : "") + val;
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <ButtonBase
                      onClick={() => {
                        handleRowClickRow2(val);
                      }}
                    >
                      <Paper
                        sx={{
                          padding: "2px 10px",
                          borderRadius: "20px",
                          display: "flex",
                          justifyContent: "center",
                          backgroundColor: colors.redDark[500],
                          color: colors.whiteOnly[500],
                          alignItems: "center",
                        }}
                      >
                        <Delete />
                        <Typography ml="5px">Remove</Typography>
                      </Paper>
                    </ButtonBase>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </>
    );
  };
  const clearItems = () => {
    setSubjectCode("");
    setSubjectCodeError("");
    setDescTitle("");
    setTerm("");
    setLecUnits("");
    setLabUnits("");
    setHoursPerWeek("");
    setPreReq([]);
    setCoReq([]);
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
                borderLeft: `5px solid ${colors.secondary[500]}`,
                paddingLeft: 2,
                textTransform: "uppercase",
              }}
            >
              Curriculum &#62; Edit &#62;{currYear} &#62; {courseYear + " Year"}{" "}
              &#62; {currVer}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ height: "100%", p: "20px", mt: 2 }}>
        <form onSubmit={handleAddItem} style={{ width: "100%" }}>
          <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
            Curriculum Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: "20px",
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={
                subjects
                  ? subjects
                      .filter((filter) => {
                        return (
                          filter.status === true &&
                          filter.courseYear === courseYear
                        );
                      })
                      .map((val) => {
                        return val?.subjectCode;
                      })
                  : []
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Subject Codes"
                  required
                  placeholder="Search"
                  error={subjectCodeError}
                />
              )}
              value={subjectCode}
              onChange={(event, newValue) => {
                setSubjectCode(newValue);
                setSubjectCodeError(false);
                subjects
                  .filter((val) => {
                    return val.subjectCode === newValue;
                  })
                  .map((val) => {
                    return (
                      setDescTitle(val?.descTitle),
                      setHoursPerWeek(val?.hoursPerWeek),
                      setLecUnits(val?.lecUnits),
                      setLabUnits(val?.labUnits),
                      setPreReq(val?.preReq),
                      setCoReq(val?.coReq),
                      setTerm(val?.courseTerm)
                    );
                  });
              }}
            />
            <TextField
              required
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Descriptive Title"
              placeholder="Descriptive Title"
              value={descTitle}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              required
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Course Term"
              F
              placeholder="Course Term"
              value={term}
            />
            <TextField
              required
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Lecture Units"
              placeholder="Descriptive Title"
              value={lecUnits && parseFloat(lecUnits).toFixed(1)}
            />

            <TextField
              required
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Lab Units"
              placeholder="Lab Title"
              value={labUnits && parseFloat(labUnits).toFixed(1)}
            />

            <TextField
              required
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Hours per Week"
              placeholder="Hours per Week"
              value={hoursPerWeek}
            />

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              value={preReq}
              // onChange={(event, newValue) => {
              //   setPreReq(newValue);
              // }}
              multiple
              options={[]}
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
              // onChange={(event, newValue) => {
              //   setCoReq(newValue);
              // }}
              multiple
              options={[]}
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
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              mt: 2,
              gridColumn: "4",
              justifyContent: "end",
              "& > .MuiButtonBase-root": {
                width: "200px",
                height: "45px",
              },
            }}
          >
            <Button
              type="button"
              variant="contained"
              color="secondary"
              sx={{ width: "250px", height: "60px" }}
              onClick={() => {
                clearItems();
              }}
            >
              <Typography variant="h5">clear</Typography>
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "250px", height: "50px" }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                add subject
              </Typography>
            </Button>
          </Box>
        </form>
        <Box mt="20px">
          <Divider sx={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
          <TableContainer
            sx={{
              height: "100%",
              alignItems: "center",
            }}
          >
            <Table aria-label="simple table" size="small">
              <SubTable yearTitle={`${courseYear + " Year Curriculum"}`} />
            </Table>
          </TableContainer>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            gridColumn: "2",
            justifyContent: "end",
            "& > .MuiButtonBase-root": {
              width: "200px",
              height: "50px",
            },
          }}
        >
          <Button
            type="button"
            variant="contained"
            color="secondary"
            sx={{ width: "250px", height: "50px" }}
            onClick={() => {
              clearFields();
            }}
          >
            <Typography variant="h5">clear</Typography>
          </Button>
          <Button
            type="button"
            variant="contained"
            sx={{ width: "250px", height: "50px" }}
            onClick={() => {
              handleCreate();
            }}
          >
            <Typography variant="h5" sx={{ color: "white" }}>
              submit
            </Typography>
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChairCurriculumEdit;

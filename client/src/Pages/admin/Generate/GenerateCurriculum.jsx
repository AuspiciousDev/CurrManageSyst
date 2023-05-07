import React from "react";
import { useReactToPrint } from "react-to-print";
import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import { useRef } from "react";
import { useState } from "react";
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
  TableContainer,
  Table,
  TableRow,
  FormControl,
  TextField,
  TableHead,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import logoBSU from "../../../assets/logoBSU.png";
import logoCICT from "../../../assets/logoCICT.png";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
const GenerateCurriculum = () => {
  const componentRef = useRef();

  const { currVerID } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [currVerDetails, setCurrVerDetails] = useState([]);
  const [curriculums, setCurriculums] = useState([]);

  const [page, setPage] = React.useState(15);

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `"COR-"${""}`,
  });

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });

        const response = await axiosPrivate.get(
          `/api/curriculumVer/version/${currVerID}`
        );
        if (response.status === 200) {
          const json = await response.data;
          setCurrVerDetails(json);
        }
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
            fontSize: "8pt",
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
      </StyledTableRow>
    );
  };
  const SubTable = ({ yearTitle }) => {
    return (
      <>
        {/* //?? 1st Term */}
        {currVerDetails && currVerDetails[0]?.term1?.courses?.length !== 0 ? (
          <>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{
                    fontSize: "16pt",
                    textTransform: "uppercase !important",
                    backgroundColor: `${colors.secondary[400]}`,
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
                  colSpan={8}
                  sx={{
                    fontSize: "10pt",
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
              {currVerDetails &&
                currVerDetails[0]?.term1?.courses?.map((val) => {
                  return (
                    <TableRow
                      sx={{
                        "& > td ": {
                          textTransform: "capitalize",
                          fontSize: "10pt",
                          color: "black",
                        },
                      }}
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
                      <TableCell
                        sx={{
                          fontSize: "7pt !important",
                          textTransform: "uppercase",
                        }}
                        align="center"
                      >
                        {val?.preReq?.map((val, key) => {
                          return (key ? ", " : "") + val.toUpperCase();
                        })}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "7pt !important",
                          textTransform: "uppercase",
                        }}
                      >
                        {val?.coReq?.map((key, val) => {
                          return (key ? ", " : "") + val;
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </>
        ) : (
          <></>
        )}
        {/* //?? 2nd Term */}
        {currVerDetails[0]?.term2?.courses?.length !== 0 ? (
          <>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={8}
                  sx={{
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
              {currVerDetails &&
                currVerDetails[0]?.term2?.courses?.map((val) => {
                  return (
                    <TableRow
                      sx={{
                        "& > td ": {
                          textTransform: "capitalize",
                          fontSize: "12pt",
                          color: "black",
                        },
                      }}
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
                      <TableCell
                        sx={{ fontSize: "6pt", textTransform: "uppercase" }}
                        align="center"
                      >
                        {val?.preReq?.map((val, key) => {
                          return (key ? ", " : "") + val.toUpperCase();
                        })}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "6pt", textTransform: "uppercase" }}
                        align="center"
                      >
                        {val?.coReq?.map((key, val) => {
                          return (key ? ", " : "") + val;
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "1em",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />

      <Paper
        ref={componentRef}
        className="RegistrationPrint"
        sx={{
          position: "relative",
          display: "flex",
          width: "900px",
          flexDirection: "column",
          // width: "793px",
          // minWidth: "793px",
          minHeight: "900px",
          padding: "20px",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            color: "black",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 15,
            }}
          >
            <img
              alt="logo"
              src={logoBSU}
              style={{ width: "100px", height: "100px" }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                Republic of the Philippines
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                Bulacan State University
              </Typography>

              <Typography variant="h5">City of Malolos, Bulacan</Typography>
              <Typography variant="h5">Tel/Fax (044) 791-0153</Typography>
            </Box>
            <img
              alt="logo"
              src={logoCICT}
              style={{ width: "100px", height: "100px" }}
            />
          </Box>
          <Typography
            variant="h4"
            mt="10px"
            textTransform="uppercase"
            fontWeight={600}
          >
            College of Information and Communication Technology
          </Typography>
          <Divider
            sx={{
              width: "80%",
              mt: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderBottomWidth: 3,
            }}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            mt: "15px",
            pt: 2,
            //   border: "1px solid black",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "black",
            }}
          >
            <Typography variant="h4" textTransform="uppercase" fontWeight={600}>
              Bachelor of Science in information Technology
            </Typography>
            <Typography variant="h4">(Based on CMO No. 25 s 2015)</Typography>
          </Box>

          <Box mt="20px">
            <Divider sx={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
            <TableContainer
              sx={{
                height: "100%",
                alignItems: "center",
              }}
            >
              <Table aria-label="simple table" size="small" title="asdasd">
                <SubTable yearTitle="1st Year" />
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Paper>
      <Box>
        {/* <Button
          sx={{ width: "200px", mt: "10px" }}
          type="button"
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button> */}
        <Button
          sx={{ width: "200px", mt: "10px", ml: "50px" }}
          type="button"
          variant="contained"
          onClick={handlePrint}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default GenerateCurriculum;

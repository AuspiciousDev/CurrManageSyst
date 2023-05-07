import React, { useEffect, useState } from "react";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import DecisionDialogue from "../../../global/DecisionDialogue";
import CreateCurrDialogue from "../../../global/CreateCurrDialogue";
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
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import Paper_Status from "../../../components/global/Paper_Status";
import Paper_Icon from "../../../components/global/Paper_Icon";
import Paper_Active from "../../../components/global/Paper_Active";
import { format } from "date-fns-tz";
import { useCurriculumsContext } from "../../../hooks/useCurriculumsContext";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar />
    </GridToolbarContainer>
  );
}
const Curriculum = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { curriculums, curriculumDispatch } = useCurriculumsContext();

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
  const [createCurrDialogue, setCreateCurrDialogue] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const columns = [
    {
      field: "currID",
      headerName: "Curriculum ID",
      width: 150,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "currYear",
      headerName: "Curriculum Year",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box display="flex" gap={2}>
            <Link
              to={`/admin/curriculums/${params?.row.currYear}/${params?.row.courseYear}`}
              style={{
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Paper
                sx={{
                  padding: "2px 10px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: colors.whiteOnly[500],
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: "10pt", color: colors.blackOnly[500] }}
                >
                  {params?.value}
                </Typography>
              </Paper>
            </Link>
          </Box>
        );
      },
    },
    {
      field: "courseYear",
      headerName: "Course Year",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <Typography variant="8pt">{params?.value} year</Typography>;
      },
    },
    {
      field: "currLatestVersion",
      headerName: "Latest Version",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            gap={2}
            width="60%"
            sx={{ justifyContent: "center" }}
          >
            <ButtonBase
              disabled={params?.value === "-"}
              onClick={() => {
                navigate(
                  `/admin/curriculums/${params?.row?.currYear}/${params?.row?.courseYear}/${params?.value}`
                );
              }}
            >
              <Paper
                sx={{
                  width: "100%",
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
                  sx={{ fontSize: "10pt", color: colors.blackOnly[500] }}
                >
                  {params?.value}
                </Typography>
              </Paper>
            </ButtonBase>
          </Box>
        );
      },
    },

    {
      field: "createdBy",
      headerName: "Created By",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 180,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
    },
    {
      field: "updatedAt",
      headerName: "Date Modified",
      width: 200,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "hh:mm a, MMMM dd, yyyy"),
    },
    {
      field: "_id",
      headerName: "Action",
      width: 175,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {auth.userType === "admin" && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <ButtonBase
                  disabled={params.row.userType === "admin"}
                  onClick={(event) => {
                    handleCellClick(event, params);
                  }}
                >
                  <Paper_Icon
                    icon={<DeleteOutline />}
                    color={`${
                      params.row.userType === "admin"
                        ? `gray`
                        : colors.redDark[500]
                    }`}
                  />
                </ButtonBase>
              </Box>
            )}
          </>
        );
      },
    },
  ];
  const handleCellClick = (event, params) => {
    event.stopPropagation();
    setValidateDialog({
      isOpen: true,
      onConfirm: () => {
        setConfirmDialog({
          isOpen: true,
          title: `Are you sure to delete Curriculum Year ${params?.row?.currYear} - Course Year ${params?.row?.courseYear} year`,
          message: `This action is irreversible!`,
          onConfirm: () => {
            handleDelete({ val: params.row });
          },
        });
      },
    });
  };
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setLoadingDialog({ isOpen: true });
      const response = await axiosPrivate.delete(
        `/api/curriculum/delete/${val.currID}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data);
        curriculumDispatch({ type: "DELETE_CURRICULUM", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `Curriculum Year ${val?.currYear} - Course Year ${val?.courseYear} year has been Deleted!`,
        });
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
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
      } else if (error.response.status === 403) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        navigate("/login", { state: { from: location }, replace: true });
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
  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });

        const response = await axiosPrivate.get("/api/curriculum/");
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          curriculumDispatch({ type: "SET_CURRICULUMS", payload: json });
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
  }, [curriculumDispatch]);

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
      <CreateCurrDialogue
        createCurrDialogue={createCurrDialogue}
        setCreateCurrDialogue={setCreateCurrDialogue}
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
              Curriculums
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Button
              type="button"
              startIcon={<Add />}
              onClick={() => {
                setCreateCurrDialogue({
                  isOpen: true,
                  onConfirm: () => {
                    setSuccessDialog({
                      isOpen: true,
                      message: `New Curriculum has been added!`,
                    });
                  },
                });
              }}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "200px" },
                height: "50px",
                marginLeft: { xs: "0", sm: "20px" },
                marginTop: { xs: "20px", sm: "0" },
              }}
            >
              <Typography variant="h6" fontWeight="500">
                Create
              </Typography>
            </Button>
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
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <DataGrid
            rows={curriculums ? curriculums : []}
            getRowId={(row) => row?.currID}
            columns={columns}
            pageSize={page}
            onPageSizeChange={(newPageSize) => setPage(newPageSize)}
            rowsPerPageOptions={[15, 50]}
            pagination
            sx={{
              "& .MuiDataGrid-cell": {
                textTransform: "capitalize",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  mainCurriculumID: false,
                  currID: false,
                  createdBy: false,
                  updatedAt: false,
                  _id: false,
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Curriculum;

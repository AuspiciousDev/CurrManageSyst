import React, { useEffect, useState } from "react";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import DecisionDialogue from "../../../global/DecisionDialogue";
import CreateSubjectDialogue from "../../../global/CreateSubjectDialogue";
import EditSubjectDialogue from "../../../global/EditSubjectDialogue";
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
  CreateOutlined,
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
import { useSubjectsContext } from "../../../hooks/useSubjectContext";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar />
    </GridToolbarContainer>
  );
}
const Subject = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { subjects, subDispatch } = useSubjectsContext();

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
  const [createSubjectDialogue, setCreateSubjectDialogue] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [editSubjectDialogue, setEditSubjectDialogue] = useState({
    isOpen: false,
    title: "",
    message: "",
    subjectCode: "",
  });
  const columns = [
    {
      field: "subjectCode",
      headerName: "Subject Code",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Typography variant="8pt" textTransform="uppercase" fontWeight={600}>
            {params?.value}
          </Typography>
        );
      },
    },
    {
      field: "descTitle",
      headerName: "Descriptive Title",
      width: 400,
      align: "center",
      headerAlign: "center",
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
      field: "courseTerm",
      headerName: "Term",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "lecUnits",
      headerName: "Lec Units",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "labUnits",
      headerName: "Lab Units",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalUnits",
      headerName: "Total Units",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hoursPerWeek",
      headerName: "Hours Per week",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "preReq",
      headerName: "Pre-req",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return params?.value?.map((value, key) => {
          return (
            <Typography
              variant="8pt"
              textTransform="uppercase"
              fontWeight={600}
            >
              {(key ? "‎ " : "") + value}
            </Typography>
          );
        });
      },
    },
    {
      field: "coReq",
      headerName: "Co-req",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return params?.value?.map((value, key) => {
          return (
            <Typography
              variant="8pt"
              textTransform="uppercase"
              fontWeight={600}
            >
              {(key ? "‎ " : "") + value}
            </Typography>
          );
        });
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
      field: "_id",
      headerName: "Action",
      width: 175,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 2 }}>
            <ButtonBase
              disableRipple
              disabled={params.row.userType === "admin"}
              onClick={(event) => {
                handleCellClick(event, params, "edit");
              }}
            >
              <Paper_Icon
                icon={<CreateOutlined />}
                color={`${colors.primary[500]}`}
              />
            </ButtonBase>
            <ButtonBase
              disableRipple
              disabled={params.row.userType === "admin"}
              onClick={(event) => {
                handleCellClick(event, params, "delete");
              }}
            >
              <Paper_Icon
                icon={<DeleteOutline />}
                color={`${
                  params.row.userType === "admin" ? `gray` : colors.redDark[500]
                }`}
              />
            </ButtonBase>
          </Box>
        );
      },
    },
  ];
  const handleCellClick = (event, params, type) => {
    event.stopPropagation();
    if (type === "edit") {
      setEditSubjectDialogue({
        isOpen: true,
        subjectCode: `${params?.row?.subjectCode}`,
        onConfirm: () => {
          setSuccessDialog({
            isOpen: true,
            message: `${params?.row?.subjectCode.toUpperCase()} has been edited!`,
          });
        },
      });
    }
    if (type === "delete") {
      setValidateDialog({
        isOpen: true,
        onConfirm: () => {
          setConfirmDialog({
            isOpen: true,
            title: `Are you sure to delete Subject ${params?.row?.subjectCode} - Course Year ${params?.row?.courseYear} year`,
            message: `This action is irreversible!`,
            onConfirm: () => {
              handleDelete({ val: params.row });
            },
          });
        },
      });
    }
  };
  const handleDelete = async ({ val }) => {
    console.log(
      "🚀 ~ file: Subject.jsx:206 ~ handleDelete ~ val:",
      val.subjectCode
    );
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    try {
      setLoadingDialog({ isOpen: true });
      const response = await axiosPrivate.delete(
        `/api/subject/delete/${val.subjectCode}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data);
        subDispatch({ type: "DELETE_SUBJECT", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `Subject ${val?.subjectCode} has been Deleted!`,
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

        const response = await axiosPrivate.get("/api/subject/");
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          subDispatch({ type: "SET_SUBJECTS", payload: json });
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
  }, [subDispatch]);

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
      <CreateSubjectDialogue
        createSubjectDialogue={createSubjectDialogue}
        setCreateSubjectDialogue={setCreateSubjectDialogue}
      />
      <EditSubjectDialogue
        editSubjectDialogue={editSubjectDialogue}
        setEditSubjectDialogue={setEditSubjectDialogue}
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
              Subjects
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
            {auth.userType !== "stakeholder" && (
              <Button
                type="button"
                startIcon={<Add />}
                onClick={() => {
                  setCreateSubjectDialogue({
                    isOpen: true,
                    onConfirm: () => {
                      setSuccessDialog({
                        isOpen: true,
                        message: `New subject has been added!`,
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
            )}
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
            rows={subjects ? subjects : []}
            getRowId={(row) => row?._id}
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
                  createdAt: false,
                  updatedAt: false,
                  gender: false,
                  _id: false,
                  createdBy: false,
                  coReq: false,
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
            getRowClassName={(params) =>
              `super-app-theme--${params.row.quantity > 20 ? "High" : "Low"}`
            }
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Subject;

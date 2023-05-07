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
} from "@mui/material";
import {
  Delete,
  CheckCircle,
  Cancel,
  Add,
  Search,
  DeleteOutline,
  AccessTime,
  VisibilityOutlined,
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
import { useFeedbacksContext } from "../../../hooks/useFeedbackContext";

import FeedbackDetailsDialogue from "../../../global/FeedbackDetailsDialogue";
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar />
    </GridToolbarContainer>
  );
}
const AdminFeedback = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { feedbacks, feedDispatch } = useFeedbacksContext();

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
  const [feedbackDetailsDialog, setFeedbackDetailsDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const getCurrVerIDValue = (val, num) => {
    var arr = val.split("_");
    return arr[num];
  };
  const columns = [
    {
      field: "feedbackID",
      headerName: "Feedback ID",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "feedbackMessage",
      headerName: "Feedback",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <ButtonBase
            onClick={() => {
              setFeedbackDetailsDialog({
                isOpen: true,
                message: `${params?.value}`,
              });
            }}
          >
            <Paper_Active icon={<VisibilityOutlined />} title={"View"} />
          </ButtonBase>
        );
      },
    },
    {
      field: "currVerID",
      headerName: "Version",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box display="flex" gap={2}>
            <Link
              to={`/admin/curriculums/${getCurrVerIDValue(
                params?.row?.currVerID,
                1
              )}/${getCurrVerIDValue(
                params?.row?.currVerID,
                0
              )}/${getCurrVerIDValue(params?.row?.currVerID, 2)}`}
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
      field: "createdBy",
      headerName: "Created By",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Typography sx={{ textTransform: "uppercase", fontSize: "0.9rem" }}>
            {params?.value}
          </Typography>
        );
      },
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
      width: 180,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
    },
    {
      field: "_id",
      headerName: "Action",
      width: 160,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <Box sx={{ display: "flex", gap: 2 }}>
              <ButtonBase
                onClick={(event) => {
                  handleCellClick(event, params);
                }}
              >
                <Paper_Icon
                  icon={<DeleteOutline />}
                  color={`${colors.redDark[500]}`}
                />
              </ButtonBase>
            </Box>
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
          title: `Are you sure to delete feedback ${params?.row?.feedbackID}`,
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
        `/api/feedback/delete/${val.feedbackID}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        feedDispatch({ type: "DELETE_FEEDBACK", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `Feedback ${val?.feedbackID} has been deleted!`,
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

        const response = await axiosPrivate.get("/api/feedback");
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          feedDispatch({ type: "SET_FEEDBACKS", payload: json });
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
  const toggleStatus = async ({ val, status }) => {
    console.log("🚀 ~ file: Request.jsx:288 ~ toggleStatus ~ val", val);
    setDecisionDialog({
      ...decisionDialog,
      isOpen: false,
    });

    const data = {
      reqID: val.reqID,
      transactor: auth.username,
      items: val.items,
      status,
    };
    console.log("🚀 ~ file: Request.jsx:329 ~ toggleStatus ~ data:", data);

    try {
      setLoadingDialog({ isOpen: true });
      if (status === "approved") {
        const apiTransact = await axiosPrivate.post(
          "/api/transaction/create",
          JSON.stringify(data)
        );
        if (apiTransact.status === 201) {
          const response = await axiosPrivate.patch(
            `/api/request/update/status/${val?.reqID}`,
            JSON.stringify(data)
          );
          if (response.status === 200) {
            const response = await axiosPrivate.get("/api/request");
            if (response.status === 200) {
              const json = await response.data;
              console.log(json);
              setSuccessDialog({
                isOpen: true,
                message: `Request ${val.reqID} ${
                  status === "approved"
                    ? "has been approved!"
                    : "has been denied!"
                }`,
              });
            }
          }
        }
      } else {
        const apiTransact = await axiosPrivate.post(
          "/api/transaction/create",
          JSON.stringify(data)
        );
        if (apiTransact.status === 201) {
          const response = await axiosPrivate.patch(
            `/api/request/update/status/${val?.reqID}`,
            JSON.stringify({ status })
          );
          if (response.status === 200) {
            const response = await axiosPrivate.get("/api/request");
            if (response.status === 200) {
              const json = await response.data;
              console.log(json);
              setSuccessDialog({
                isOpen: true,
                message: `Request ${val.reqID} ${
                  status === "approved"
                    ? "has been approved!"
                    : "has been denied!"
                }`,
              });
            }
          }
        }
      }

      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log("🚀 ~ file: User.jsx:169 ~ toggleStatus ~ error", error);
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
      <FeedbackDetailsDialogue
        feedbackDetailsDialog={feedbackDetailsDialog}
        setFeedbackDetailsDialog={setFeedbackDetailsDialog}
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
              Feedbacks
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
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <DataGrid
            rows={feedbacks ? feedbacks : []}
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
                  mainCurriculumID: false,
                  currID: false,
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

export default AdminFeedback;

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
  LockResetOutlined,
  CreateOutlined,
  PendingActionsOutlined,
  Visibility,
  RateReviewOutlined,
  AvTimerOutlined,
  CancelOutlined,
  CheckCircleOutline,
  LocalPrintshopOutlined,
  VisibilityOutlined,
  AddOutlined,
  ArchiveOutlined,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import Paper_Status from "../../../components/global/Paper_Status";
import Paper_Icon from "../../../components/global/Paper_Icon";
import Paper_Active from "../../../components/global/Paper_Active";
import Paper_CurrStatus from "../../../components/global/Paper_CurrStatus";
import { format } from "date-fns-tz";
import { useCurriculumsVerContext } from "../../../hooks/useCurriculumsVerContext";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar />
    </GridToolbarContainer>
  );
}
const Curriculum = () => {
  const { currYear, courseYear } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { curriculumsVer, curriculumVerDispatch } = useCurriculumsVerContext();

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

  const columns = [
    {
      field: "currVerID",
      headerName: "Curriculum Ver #",
      align: "center",
      headerAlign: "center",
      width: 250,
    },
    {
      field: "currVer",
      headerName: "Version",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box display="flex" gap={2}>
            <Link
              to={`/admin/curriculums/${currYear}/${courseYear}/${params?.value}`}
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
    },
    {
      field: "chairApproval",
      headerName: "Chairperson Approval",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.value === "approved" ? (
              <Paper_CurrStatus
                icon={<CheckCircleOutline />}
                title={"approved"}
                type={`${params?.value}`}
              />
            ) : params?.value === "denied" ? (
              <Paper_CurrStatus
                icon={<CancelOutlined />}
                title={"denied"}
                type={`${params?.value}`}
              />
            ) : (
              params?.value === "" && (
                <Paper_CurrStatus title={"-"} type={`${params?.value}`} />
              )
            )}
          </>
        );
      },
    },
    {
      field: "stakeHolderApprovalStatus",
      headerName: "Stakeholder Approval",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.value === "approved" ? (
              <Paper_CurrStatus
                icon={<CheckCircleOutline />}
                title={"approved"}
                type={`${params?.value}`}
              />
            ) : params?.value === "denied" ? (
              <Paper_CurrStatus
                icon={<CancelOutlined />}
                title={"denied"}
                type={`${params?.value}`}
              />
            ) : (
              params?.value === "" && (
                <Paper_CurrStatus title={"-"} type={`${params?.value}`} />
              )
            )}
          </>
        );
      },
    },

    {
      field: "deanApproval",
      headerName: "Dean Approval",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.value === "approved" ? (
              <Paper_CurrStatus
                icon={<CheckCircleOutline />}
                title={"approved"}
                type={`${params?.value}`}
              />
            ) : params?.value === "denied" ? (
              <Paper_CurrStatus
                icon={<CancelOutlined />}
                title={"denied"}
                type={`${params?.value}`}
              />
            ) : (
              params?.value === "" && (
                <Paper_CurrStatus title={"-"} type={`${params?.value}`} />
              )
            )}
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <ButtonBase
              disabled={params.value !== "deanReview"}
              onClick={() => {
                setValidateDialog({
                  isOpen: true,
                  onConfirm: () => {
                    setDecisionDialog({
                      isOpen: true,
                      title: `Are you sure to approve curriculum ${params?.row?.currVerID}? `,
                      onConfirm: () => {
                        toggleStatus({
                          val: params?.row,
                          status: "approved",
                        });
                      },
                      onDeny: () => {
                        toggleStatus({
                          val: params?.row,
                          status: "denied",
                        });
                      },
                    });
                  },
                });
              }}
            >
              {params?.value === "chairReview" ? (
                <Paper_CurrStatus
                  icon={<AvTimerOutlined />}
                  title={"Chair Review"}
                  type={`${params?.value}`}
                />
              ) : params?.value === "stakeReview" ? (
                <Paper_CurrStatus
                  icon={<CheckCircleOutline />}
                  title={"Stake Review"}
                  type={`${params?.value}`}
                />
              ) : params?.value === "deanReview" ? (
                <Paper_CurrStatus
                  icon={<CheckCircleOutline />}
                  title={"Dean Review"}
                  action={"approved"}
                  type={`${params?.value}`}
                />
              ) : params?.value === "approved" ? (
                <Paper_CurrStatus
                  icon={<CheckCircleOutline />}
                  title={"approved"}
                  type={`${params?.value}`}
                />
              ) : params?.value === "ongoing" ? (
                <Paper_CurrStatus
                  icon={<DrawOutlined />}
                  title={"ongoing"}
                  action={"submit"}
                  type={`${params?.value}`}
                />
              ) : params?.value === "denied" ? (
                <Paper_CurrStatus
                  icon={<CheckCircleOutline />}
                  title={"denied"}
                  type={`${params?.value}`}
                />
              ) : (
                <Paper_CurrStatus
                  icon={<PendingActionsOutlined />}
                  title={"pending"}
                  type={`${params?.value}`}
                />
              )}
            </ButtonBase>
          </>
        );
      },
    },
    {
      field: "feedBacks",
      headerName: "Feedbacks",
      width: 300,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <Box sx={{ display: "flex", gap: 2 }}>
              <ButtonBase
                onClick={() => {
                  navigate(
                    `/admin/feedbacks/${currYear}/${courseYear}/${params?.row?.currVer}/${params?.row?.currVerID}/create`
                  );
                }}
              >
                <Paper_Active icon={<AddOutlined />} title={"Create"} />
              </ButtonBase>
              <ButtonBase
                onClick={() => {
                  navigate(
                    `/admin/feedbacks/${currYear}/${courseYear}/${params?.row?.currVer}/${params?.row?.currVerID}`
                  );
                }}
              >
                <Paper_Active icon={<VisibilityOutlined />} title={"View"} />
              </ButtonBase>
            </Box>
          </>
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
      width: 200,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "hh:mm a, MMMM dd, yyyy"),
    },

    {
      field: "_id",
      headerName: "Action",
      width: 250,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <Box sx={{ display: "flex", gap: 2 }}>
              <ButtonBase
                disabled={params.row.userType === "admin"}
                onClick={(event) => {
                  navigate(`/admin/generate/${params?.row.currVerID}`);
                }}
              >
                <Paper_Icon
                  icon={<LocalPrintshopOutlined />}
                  color={`${colors.primary[500]}`}
                />
              </ButtonBase>
              <ButtonBase
                onClick={(event) => {
                  handleArchiveClick(event, params);
                }}
              >
                <Paper_Icon
                  icon={<ArchiveOutlined />}
                  color={`${colors.primary[500]}`}
                />
              </ButtonBase>
              <ButtonBase
                disabled={params.row.userType === "admin"}
                onClick={(event) => {
                  navigate(`${params?.row.currVer}/edit`);
                }}
              >
                <Paper_Icon
                  icon={<CreateOutlined />}
                  color={`${colors.primary[500]}`}
                />
              </ButtonBase>
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

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });

        const response = await axiosPrivate.get(
          `/api/curriculumVer/versions/${courseYear + "_" + currYear}`
        );
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          curriculumVerDispatch({ type: "SET_CURRICULUMSVERS", payload: json });
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
  }, [curriculumVerDispatch]);

  const handleCellClick = (event, params) => {
    event.stopPropagation();
    setValidateDialog({
      isOpen: true,
      onConfirm: () => {
        setConfirmDialog({
          isOpen: true,
          title: `Are you sure to delete curriculum version ${params?.row?.currVerID}`,
          message: `This action is irreversible!`,
          onConfirm: () => {
            handleDelete({ val: params.row });
          },
        });
      },
    });
  };
  const handleArchiveClick = (event, params) => {
    event.stopPropagation();
    setValidateDialog({
      isOpen: true,
      onConfirm: () => {
        setConfirmDialog({
          isOpen: true,
          title: `Are you sure to archive curriculum version ${params?.row?.currVerID}`,
          onConfirm: () => {
            handleArchived({ val: params.row });
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
        `/api/curriculumVer/delete/${val.currVerID}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        curriculumVerDispatch({ type: "DELETE_CURRICULUMVER", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `Curriculum version ${val?.currVerID} has been deleted!`,
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
  const handleArchived = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    try {
      setLoadingDialog({ isOpen: true });
      const doc = {
        status: "archived",
      };

      const apiCurrVerStatus = await axiosPrivate.patch(
        `/api/curriculumVer/status/archive/${val?.currVerID}`,
        JSON.stringify(doc)
      );
      if (apiCurrVerStatus.status === 200) {
        const apiCurrVer = await axiosPrivate.get(
          `/api/curriculumVer/versions/${courseYear + "_" + currYear}`
        );
        if (apiCurrVer.status === 200) {
          const json = await apiCurrVer.data;
          console.log(json);
          curriculumVerDispatch({ type: "SET_CURRICULUMSVERS", payload: json });
        }
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
  const toggleStatus = async ({ val, status }) => {
    setDecisionDialog({
      ...decisionDialog,
      isOpen: false,
    });

    try {
      setLoadingDialog({ isOpen: true });
      const doc = {
        status: status === "approved" ? "approved" : "denied",
        deanApproval: status,
      };

      const apiCurrVerStatus = await axiosPrivate.patch(
        `/api/curriculumVer/status/${val?.currVerID}`,
        JSON.stringify(doc)
      );
      if (apiCurrVerStatus.status === 200) {
        const apiCurrVer = await axiosPrivate.get(
          `/api/curriculumVer/versions/${courseYear + "_" + currYear}`
        );
        if (apiCurrVer.status === 200) {
          const json = await apiCurrVer.data;
          console.log(json);
          curriculumVerDispatch({ type: "SET_CURRICULUMSVERS", payload: json });
        }
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
              Curriculums &#62; {currYear} &#62; {courseYear + " Year"}
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
            {auth.userType === "admin" && (
              <Button
                type="button"
                startIcon={<Add />}
                onClick={() => {
                  navigate("create");
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
            rows={
              curriculumsVer
                ? curriculumsVer.filter((val) => {
                    return (
                      val.currID === courseYear + "_" + currYear &&
                      val?.status !== "archived"
                    );
                  })
                : []
            }
            getRowId={(row) => row?.currVerID}
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
                  mainCurriculumID: false,
                  gender: false,
                  currVerID: false,
                  updatedAt: false,
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

export default Curriculum;

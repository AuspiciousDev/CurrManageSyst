import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import feedbackIMG from "../assets/feedbackIMG.svg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
export const FeedbackDetailsDialogue = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { feedbackDetailsDialog, setFeedbackDetailsDialog } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return setFeedbackDetailsDialog({
        ...feedbackDetailsDialog,
        isOpen: false,
      });
  };
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={feedbackDetailsDialog.isOpen}
      onClose={handleClose}
    >
      <DialogTitle sx={{ margin: "3em 10em" }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <img src={feedbackIMG} alt="welcome" style={{ width: "300px" }} />{" "}
          <Typography variant="h2">Feedback</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3">{feedbackDetailsDialog?.message}</Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          mb: "10px",
          gap: 2,
          padding: "10px 50px",
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={() =>
            setFeedbackDetailsDialog({
              ...feedbackDetailsDialog,
              isOpen: false,
            })
          }
          // onClick={feedbackDetailsDialog.onConfirm}
        >
          Exit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default FeedbackDetailsDialogue;

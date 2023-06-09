import React from "react";
import {
  Avatar,
  Box,
  Divider,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { ListAltOutlined, PersonOutline } from "@mui/icons-material";
import { tokens } from "../../../theme";
const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const PaperLinks = (props) => {
    const { title, to, icon } = props;
    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        <Typography variant="h3" textTransform="uppercase" color="black">
          {title}
        </Typography>
      </Link>
    );
  };
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-evenly",
        padding: 4,
        gap: 1,
        marginBottom: 2,
        "&.MuiBox-root > .MuiBox-root": {
          width: "100%",
          display: "flex",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img src={logo} alt="" style={{ width: "50px" }} />
            <Typography
              variant="h3"
              textTransform="uppercase"
              sx={{ color: `${colors.black[900]}` }}
            >
              Curriculum Management System
            </Typography>
          </Box>
        </Link>
      </Box>

      {/* <Box sx={{ justifyContent: "center", alignItems: "center", gap: 6 }}>
        <PaperLinks title="Home" to="/" />
        <Divider orientation="vertical" sx={{ height: "35px" }} />
        <PaperLinks title="Inventory" to="/public/inventory" />
        <Divider orientation="vertical" sx={{ height: "35px" }} />
        <PaperLinks title="Signup" to="/register" />
      </Box> */}
      <Box sx={{ justifyContent: "flex-end", alignItems: "center", gap: 3 }}>
        <Link to="/login">
          <Avatar
            sx={{
              width: "50px",
              height: "50px",
              bgcolor: `${colors.primary[500]}`,
            }}
          />
        </Link>
      </Box>
    </Box>
  );
};

export default Navbar;

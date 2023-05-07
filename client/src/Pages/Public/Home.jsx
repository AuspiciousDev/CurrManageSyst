import React from "react";
import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import welcome2 from "../../assets/welcome6.svg";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
const Home = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const BoxLinks = (props) => {
    const { title, to } = props;
    return (
      <Box>
        <Link to={to} style={{ textDecoration: "none" }}>
          <Typography variant="h3" sx={{ color: `${colors.black[100]}` }}>
            {title}
          </Typography>
        </Link>
      </Box>
    );
  };
  return (
    <Box
      className="container-page"
      sx={{
        flexDirection: "column",
        paddingLeft: 5,
        paddingRight: 5,
        background: `linear-gradient(180deg,${colors.primary[500]} 0%, ${colors.secondary[500]} 50%)`,
      }}
    >
      <Navbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          height: "100%",
        }}
      >
        <Box sx={{ width: "700px" }}>
          <Typography
            sx={{ fontSize: "45pt" }}
            textTransform="uppercase"
            fontWeight="600"
          >
            Curriculum Management System
          </Typography>
          <br />
          <Typography variant="h3">
            One stop system to manage your curriculum
          </Typography>
          <Divider
            sx={{
              m: "2em 0",
              borderBottomWidth: 5,
              width: "200px",
              backgroundColor: `${colors.primary[500]}`,
            }}
          />
          <Box
            sx={{
              width: "700px",
              display: "flex",
              gap: 5,
              "&.MuiBox-root > div": {
                width: "15em",
                p: 2,
                border: "1px solid black",
                borderRadius: 3,
              },
            }}
          >
            <BoxLinks title="Manage now!" to="/login" />
          </Box>
        </Box>
        <img src={welcome2} alt="" style={{ width: "700px" }} />
      </Box>
    </Box>
  );
};

export default Home;

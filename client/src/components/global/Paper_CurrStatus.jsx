import { Paper, useTheme, Typography, Box, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import {
  CheckCircleOutline,
  CheckOutlined,
  CheckCircle,
} from "@mui/icons-material";
function useHover() {
  const [hovering, setHovering] = useState(false);
  const onHoverProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  };
  return [hovering, onHoverProps];
}
const Paper_CurrStatus = (props) => {
  const { title, icon, type, action } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [buttonHover, setButtonHover] = useHover();
  return (
    <>
      {type === "denied" ? (
        <Paper
          sx={{
            display: "flex",
            padding: "2px 10px",
            backgroundColor: colors.redDark[500],
            color: colors.whiteOnly[500],
            borderRadius: "20px",
            alignItems: "center",
            width: "160px",
            justifyContent: "center",
          }}
        >
          {icon}
          <Typography ml="5px" textTransform="uppercase">
            {title}
          </Typography>
        </Paper>
      ) : type === "approved" ? (
        <Paper
          sx={{
            display: "flex",
            padding: "2px 10px",
            backgroundColor: `#7ffa7f`,
            borderRadius: "20px",
            alignItems: "center",
            width: "160px",
            justifyContent: "center",
            color: "black",
          }}
        >
          {icon}
          <Typography ml="5px" textTransform="uppercase" color="black">
            {title}
          </Typography>
        </Paper>
      ) : type === "ongoing" ? (
        <Paper
          sx={{
            display: "flex",
            padding: "2px 10px",
            backgroundColor: `${buttonHover ? "#7ffa7f" : "#FFF"}`,
            // color: `${
            //   buttonHover ? colors.whiteOnly[500] : colors.blackOnly[500]
            // }`,
            color: `${colors.blackOnly[500]}`,
            borderRadius: "20px",
            alignItems: "center",
            width: "160px",
            justifyContent: "center",
          }}
          {...setButtonHover}
        >
          {buttonHover ? <CheckCircleOutline /> : icon}
          <Typography ml="5px" textTransform="uppercase">
            {buttonHover ? action : title}
          </Typography>
        </Paper>
      ) : type === "" ? (
        <Paper
          sx={{
            display: "flex",
            padding: "2px 10px",
            borderRadius: "20px",
            alignItems: "center",
            width: "160px",
            justifyContent: "center",
          }}
        >
          {icon}
          <Typography ml="5px" textTransform="uppercase">
            {title}
          </Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            display: "flex",
            padding: "2px 10px",
            backgroundColor: `${
              buttonHover ? "#7ffa7f" : colors.secondary[500]
            }`,
            // color: `${
            //   buttonHover ? colors.whiteOnly[500] : colors.blackOnly[500]
            // }`,
            color: `${colors.blackOnly[500]}`,
            borderRadius: "20px",
            alignItems: "center",
            width: "160px",
            justifyContent: "center",
          }}
          {...setButtonHover}
        >
          {buttonHover ? <CheckCircleOutline /> : icon}
          <Typography ml="5px" textTransform="uppercase">
            {buttonHover ? action : title}
          </Typography>
        </Paper>
      )}
    </>
  );
};

export default Paper_CurrStatus;

import React from "react";
import { Box, IconButton } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const SectionNavigator = ({
  showUp = false,
  showDown = false,
  onUpClick,
  onDownClick,
}) => {
  const theme = useTheme();

  const buttonStyle = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: 50,
    height: 50,
    boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      transform: "translateX(-50%) scale(1.1)",
      boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)",
    },
    transition: "all 0.3s ease",
    zIndex: 10,
  };

  return (
    <>
      {/* Flecha hacia arriba */}
      {showUp && (
        <IconButton
          onClick={onUpClick}
          sx={{
            ...buttonStyle,
            top: 20,
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      )}

      {/* Flecha hacia abajo */}
      {showDown && (
        <IconButton
          onClick={onDownClick}
          sx={{
            ...buttonStyle,
            bottom: 20,
          }}
        >
          <KeyboardArrowDown />
        </IconButton>
      )}
    </>
  );
};

export default SectionNavigator;

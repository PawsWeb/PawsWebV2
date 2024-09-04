import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  styled,
  alpha,
} from "@mui/material";

import logo from "../../assets/images/logo.png";
import ReorderIcon from "@mui/icons-material/Reorder";
import LoginIcon from "@mui/icons-material/Login";

const navBtnStyle = {
  backgroundColor: "transparent",
  color: "#000",
  marginRight: "10px",
  fontSize: "16px",
  fontWeight: "700",
  padding: "0.1rem 1.0rem",
};

const reorderBtnStyle = {
  backgroundColor: "transparent",
  color: "#000",
};

const loginBtn = {
  color: "#987554",
};

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function GeneralNavbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenuItems = () =>
    ["Home", "Pets", "Educational", "FAQ", "Contact"].map((text) => (
      <MenuItem
        key={text}
        onClick={handleMenuClose}
        style={{ fontWeight: "600" }}
        component={Link}
        to={`/${text.toLowerCase()}`}
      >
        {text}
      </MenuItem>
    ));

  return (
    <AppBar sx={{ bgcolor: "white", height: "100px" }}>
      <Toolbar>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="PawsWeb Logo"
            style={{ marginTop: "5px", width: "150px" }}
          />
          {isSmallScreen ? (
            <>
              <IconButton
                style={{
                  position: "absolute",
                  left: "90%",
                  transform: "translateX(-50%)",
                }}
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <ReorderIcon style={reorderBtnStyle} />
              </IconButton>
              <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {renderMenuItems()}
              </StyledMenu>
            </>
          ) : (
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              {["Home", "Pets", "Educational", "FAQ", "Contact"].map((text) => (
                <Button
                  key={text}
                  variant="text"
                  style={navBtnStyle}
                  component={Link}
                  to={`/${text.toLowerCase()}`}
                >
                  {text}
                </Button>
              ))}
            </Box>
          )}
          <Link
            to="/login"
            style={{ textDecoration: "none", marginLeft: "auto" }}
          >
            <IconButton aria-label="Login">
              <LoginIcon style={loginBtn} />
            </IconButton>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default GeneralNavbar;

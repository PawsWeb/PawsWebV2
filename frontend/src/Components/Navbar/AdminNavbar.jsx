import React from "react"
import { Link } from "react-router-dom"
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material"

import logo from "../../assets/images/logo.png"
import IconButton from "@mui/material/IconButton"
import LogoutIcon from "@mui/icons-material/Logout"

function AdminNavbar({userName}) {
  const button = {
    backgroundColor: "transparent",
    color: "#000",
    marginRight: "10px",
    fontSize: "16px",
    fontWeight: "700",
    padding: "0.1rem 1.0rem",
  }

  const name = {
    color: "#000",
    fontSize: "14px",
    marginRight: "5px"
  }

  return (
    <>
        <AppBar sx={{ bgcolor: "white", height: "100px" }}>
        <Toolbar>
          <img src={logo} alt="PawsWeb Logo" style={{ marginTop: "5px", width: "150px" }}/>

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Button variant="text" style={button} component={Link} to="/home">
              Home
            </Button>

            <Button variant="text" style={button} component={Link} to="/admin/listing-page">
              Pets
            </Button>

            <Button variant="text" style={button} component={Link} to="/educational">
              Educational
            </Button>

            <Button variant="text" style={button} component={Link} to="/faq">
              FAQ
            </Button>

          </Box>

          <Typography style={name}>
          {userName}
          </Typography>

          <Link to="/logout" style={{ textDecoration: "none" }}>
              <IconButton aria-label="Logout" color="error">
                <LogoutIcon />
              </IconButton>
          </Link>

        </Toolbar>
      </AppBar>
    </>
  )
}

export default AdminNavbar
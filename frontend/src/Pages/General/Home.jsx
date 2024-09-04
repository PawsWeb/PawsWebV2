import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../App";
import { Button, Typography, Grid, Paper } from "@mui/material";

function Home() {
  const { userRole } = useContext(UserRoleContext);
  const navigate = useNavigate();

  const paperStyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "0.5rem",
    border: "1px solid #453a2f",
    boxShadow: "10px 10px 10px #453a2f",
    width: "80vw", // Default width for extra-small screens
    maxWidth: "400px", // Max width for larger screens
    textAlign: "center", // Center-align text within the paper
  };

  const buttonStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
  };

  const handleHomepageEditor = () => {
    navigate("/admin/home");
  };

  return (
    <>
      <Grid align="center">
        <Paper style={paperStyle}>
          <Typography variant="h4" gutterBottom>
            Welcome to PawsWeb
          </Typography>
          <Typography variant="body1" gutterBottom>
            Discover your perfect pet companion today!
          </Typography>
          {userRole === "admin" && (
            <Button
              variant="contained"
              style={buttonStyle}
              onClick={handleHomepageEditor}
            >
              Admin Dashboard
            </Button>
          )}
        </Paper>
      </Grid>
    </>
  );
}

export default Home;

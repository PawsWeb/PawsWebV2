import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../App";
import { Button, Typography, Grid, Paper } from "@mui/material";

function Home() {
  const { userRole } = useContext(UserRoleContext);
  const navigate = useNavigate();

  const paperStyle = {
    height: "auto",
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "0.5rem",
    border: "1px solid #453a2f",
    boxShadow: "10px 10px 10px #453a2f",
  };

  const buttonStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
  };

  const handleHomepageEditor = () => {
    navigate("/admin/home");
  };

  return (
    <Grid align="center">
      <Paper
        style={paperStyle}
        sx={{
          width: {
            xs: "80vw",
            sm: "50vw",
            md: "40vw",
            lg: "30vw",
            xl: "20vw",
          },
          height: "60vh",
        }}
      >
        <Typography variant="h4">Welcome to Home Page</Typography>
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
  );
}

export default Home;

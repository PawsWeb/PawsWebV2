import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const paperStyle = {
    height: "auto",
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    border: "1px solid #453a2f",
    boxShadow: "10px 10px 10px #453a2f"
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const text = { marginTop: "2rem", fontSize: "1.0rem", fontWeight: "300" };
  const row = { display: "flex", marginTop: "2rem" };
  const registerBtn = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
  };
  const loginBtn = {
    marginTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#f4e3d3",
    color: "#453a2f",
    borderRadius: "0.5rem",
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("adopters");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/register", { name, email, password, role })
      .then((result) => {
        if (result.status == 201) {
          console.log("User created successfully");
          navigate("/login");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          window.alert("Email already exists. Please use a different email.");
        } else {
          console.log(err);
        }
      });
  };

  return (
    <>
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
          <Typography style={heading}>Register</Typography>
          <form onSubmit={handleRegister}>
            <TextField
              style={row}
              onChange={(e) => setName(e.target.value)}
              label="Enter Name"
              type="text"
              name="name"
              required
            ></TextField>
            <TextField
              style={row}
              onChange={(e) => setEmail(e.target.value)}
              label="Enter Email"
              type="email"
              name="email"
              required
            ></TextField>
            <TextField
              style={row}
              onChange={(e) => setPassword(e.target.value)}
              label="Enter Password"
              type="password"
              name="password"
              required
            ></TextField>
            <FormControl style={row}>

              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <MenuItem value="adopters">Adopters</MenuItem>
                <MenuItem value="staffs">Staffs</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" style={registerBtn} type="submit">
              Register
            </Button>
            <Typography style={text}>
              Already have an account?
            </Typography>
            <Button
              variant="contained"
              style={loginBtn}
              component={Link}
              to="/login"
            >
              Login
            </Button>
          </form>
        </Paper>
      </Grid>
    </>
  );
}

export default Register;

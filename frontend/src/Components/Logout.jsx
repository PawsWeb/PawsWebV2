import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SetIsLoggedInContext } from "../App";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

function Logout() {
  const setIsLoggedIn = useContext(SetIsLoggedInContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    const response = await axios.get("http://localhost:3001/logout", {
      withCredentials: true,
    });
    try {
      if (response.status === 200) {
        setIsLoggedIn(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <IconButton aria-label="Logout" color="error" onClick={handleLogout}>
      <LogoutIcon />
    </IconButton>
  );
}

export default Logout;

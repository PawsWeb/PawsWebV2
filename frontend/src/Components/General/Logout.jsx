import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SetIsLoggedInContext, UserRoleContext } from "../../App";

function Logout() {
  const setIsLoggedIn = useContext(SetIsLoggedInContext);
  const { setUserRole } = useContext(UserRoleContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:3001/logout", {}, { withCredentials: true })
      .then(() => {
        console.log("Logout successful, redirecting...");
        setIsLoggedIn(false);
        setUserRole(null);

        navigate("/login");
      })
      .catch((err) => console.log("Logout failed:", err));
  }, [navigate, setIsLoggedIn, setUserRole]);

  return <p>Logging out...</p>;
}

export default Logout;

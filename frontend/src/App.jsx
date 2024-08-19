import { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";

import Navbar from "./Components/Navbar";
import axios from "axios";
import AdminHome from "./Components/Admin/home";
import StaffsHome from "./Components/Staff/Home";
import AdoptersHome from "./Components/Adopter/Home";

export const IsLoggedInContext = createContext();
export const SetIsLoggedInContext = createContext();
export const UserRoleContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/user", { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setIsLoggedIn(true);
          setUserRole(response.data.user.role);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserRole(null);
      });
  }, []);

  return (
    <>
      <IsLoggedInContext.Provider value={isLoggedIn}>
        <SetIsLoggedInContext.Provider value={setIsLoggedIn}>
          <UserRoleContext.Provider value={{userRole, setUserRole}}>
            <Router>
              <Navbar />
              <Routes>
                <Route
                  path="/login"
                  element={
                    isLoggedIn ? (
                      <Navigate to={`/${userRole}-home`} />
                    ) : (
                      <Login />
                    )
                  }
                ></Route>
                <Route
                  path="/register"
                  element={
                    isLoggedIn ? <Navigate to="/register" /> : <Register />
                  }
                ></Route>
                <Route
                  path="/admin-home"
                  element={
                    isLoggedIn && userRole === "admin" ? (
                      <AdminHome />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                ></Route>
                <Route
                  path="/adopters-home"
                  element={
                    isLoggedIn && userRole === "adopters" ? (
                      <AdoptersHome />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                ></Route>
                <Route
                  path="/staffs-home"
                  element={
                    isLoggedIn && userRole === "staffs" ? (
                      <StaffsHome />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                ></Route>
              </Routes>
            </Router>
          </UserRoleContext.Provider>
        </SetIsLoggedInContext.Provider>
      </IsLoggedInContext.Provider>
    </>
  );
}

export default App;

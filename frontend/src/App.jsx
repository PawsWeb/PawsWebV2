import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import GeneralNavbar from "./Components/Navbar/GeneralNavbar";
import AdminNavbar from "./Components/Navbar/AdminNavbar";
import StaffNavbar from "./Components/Navbar/StaffNavbar";
import AdopterNavbar from "./Components/Navbar/AdopterNavbar";

import Home from "./Components/General/Home";
import HomepageEditor from "./Components/Admin/HomepageEditor";
import Login from "./Components/General/Login";
import Logout from "./Components/General/Logout";
import Register from "./Components/General/Register";
import VerifyOtp from "./Components/General/VerifyOtp";
import Pets from "./Components/General/Pets";
import AdopterPets from "./Components/Adopter/AdopterPets";
import StaffPets from "./Components/Staff/StaffPets";
import Educational from "./Components/General/Educational";
import EducationalEditor from "./Components/Admin/EducationalEditor";
import Faq from "./Components/General/Faq";
import FaqEditor from "./Components/Admin/FaqEditor";
import Contact from "./Components/General/Contact";

export const IsLoggedInContext = createContext();
export const SetIsLoggedInContext = createContext();
export const UserRoleContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/user", { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setIsLoggedIn(true);
          setUserRole(response.data.user.role);
          setUserName(response.data.user.name);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
          setUserName("");
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName("");
      });
  }, []);

  const renderNavbar = () => {
    switch (userRole) {
      case "admin":
        return <AdminNavbar userName={userName} />;
      case "staff":
        return <StaffNavbar userName={userName} />;
      case "adopter":
        return <AdopterNavbar userName={userName} />;
      default:
        return <GeneralNavbar />;
    }
  };

  return (
    <IsLoggedInContext.Provider value={isLoggedIn}>
      <SetIsLoggedInContext.Provider value={setIsLoggedIn}>
        <UserRoleContext.Provider value={{ userRole, setUserRole }}>
          <Router>
            {renderNavbar()}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/home" element={<Home />} />
              <Route path="/admin/home" element={<HomepageEditor />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/adopter/pets" element={<AdopterPets />} />
              <Route path="/staff/pets" element={<StaffPets />} />
              <Route path="/educational" element={<Educational />} />
              <Route
                path="/admin/educational"
                element={<EducationalEditor />}
              />
              <Route path="/faq" element={<Faq />} />
              <Route path="/admin/faq" element={<FaqEditor />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Router>
        </UserRoleContext.Provider>
      </SetIsLoggedInContext.Provider>
    </IsLoggedInContext.Provider>
  );
}

export default App;

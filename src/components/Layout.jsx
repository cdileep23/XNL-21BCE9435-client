import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavbarSpecial from "./NavbarSpecial";
import Footer from "./Footer";
import { BASE_URL } from "../utils/url";
import axios from "axios";

const Body = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const checkUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/check-user`, {
        withCredentials: true,
      });
      console.log("in layout");
      console.log(response);
      
      setUserType(response.data.userType);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };
  
  useEffect(() => {
    checkUser();
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="layout-container">
      <NavbarSpecial userType={userType} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
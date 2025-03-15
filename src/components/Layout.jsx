import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavbarSpecial from "./NavbarSpecial"
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
      
      if (!response.data.success) {
        navigate("/");
      } else {
        // Store the userType from the API response
        setUserType(response.data.userType);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error)
      navigate("/");
    }
  };
  
  useEffect(() => {
    checkUser();
  }, []);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <NavbarSpecial userType={userType} />
      <main className="flex-grow w-full mt-4 mb-4">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Body;
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BASE_URL } from "../utils/url";
import axios from "axios";

const Body = () => {
  const navigate = useNavigate();

  const checkUser = async () => {
    try {
      const response = await axios.get(BASE_URL + "/check-user", {
        withCredentials: true,
      });

      if (response.data.success) {
        navigate(`/${response.data.userType}`);
      } 
    } catch (error) {
      console.log(error)
     
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <main className="flex-grow w-full mt-4 mb-4">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Body;

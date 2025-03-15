import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-extrabold text-gray-700">404</h1>
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full my-6"></div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-12 h-12 border-4 border-gray-200 rounded-full opacity-20 animate-spin-slow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-blue-200 rounded-full opacity-30"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20"></div>
      
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
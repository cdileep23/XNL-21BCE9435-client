import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="border-b sticky top-0 bg-white z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-primary">FreelanceHub</h1>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Find Work</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Find Talent</a>
            <a href="#howitworks" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to='/login'>
          <Button variant="ghost" className="hidden md:inline-flex">Log In</Button>
          </Link>
         <Link to="/register">
         <Button className="hidden md:inline-flex">Sign Up</Button>
         </Link>
         
          <button className="md:hidden" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Find Work</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Find Talent</a>
            <a href="#howitworks" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Link to='/login'>
              <Button variant="ghost" className="justify-center w-full">Log In</Button>
              </Link>
              <Link to="/register">
              <Button className="justify-center w-full">Sign Up</Button>
              </Link>
             
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
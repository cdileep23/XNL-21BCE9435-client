import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const Navbar = ({ userType }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:7000/user/logout', {
        withCredentials: true
      });
      toast.success("User LogOut Successful")
      navigate('/'); // Redirect to homepage on successful logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Determine which links to show based on userType
  const isFreelancer = userType === 'freelancer';
  
  return (
    <header className="border-b sticky top-0 bg-white z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-primary">FreelanceHub</h1>
          <nav className="hidden md:flex items-center gap-6">
            {isFreelancer && (
              <Link to="/freelancer/applications" className="text-sm font-medium hover:text-primary transition-colors">
                Applications
              </Link>
            )}
            <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
              Profile
            </Link>
            {isFreelancer ? (
              <Link to="/freelancer" className="text-sm font-medium hover:text-primary transition-colors">
                Gigs
              </Link>
            ) : (
              <Link to="/jobposter" className="text-sm font-medium hover:text-primary transition-colors">
                My Jobs
              </Link>
            )}
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden md:inline-flex"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </Button>
          
          <button className="md:hidden" onClick={toggleMobileMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
            {isFreelancer && (
              <Link to="/freelancer/applications" className="text-sm font-medium hover:text-primary transition-colors">
                Applications
              </Link>
            )}
            <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
              Profile
            </Link>
            {isFreelancer ? (
              <Link to="/freelancer" className="text-sm font-medium hover:text-primary transition-colors">
                Gigs
              </Link>
            ) : (
              <Link to="/jobposter" className="text-sm font-medium hover:text-primary transition-colors">
                My Jobs
              </Link>
            )}
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Button
                variant="ghost"
                className="justify-center w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2" size={18} />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
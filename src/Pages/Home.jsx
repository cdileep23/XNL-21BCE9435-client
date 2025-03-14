import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Search } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BASE_URL } from '../utils/url';

const HomePage = () => {
  const navigate = useNavigate();

  // Redirect logic
  const checkUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/check-user`, { withCredentials: true });

      if (response.data.success) {
        const userType = response.data.userType?.toLowerCase();
        navigate(`/${userType}`); // Redirect to '/dashboard' or relevant route
      }
    } catch (error) {
      console.log(error)
      console.log("User not authenticated, staying on home page.");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Connect with top freelance talent
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Post jobs, find experts, and collaborate seamlessly on our secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8">Find Talent</Button>
                <Button size="lg" variant="outline" className="px-8">Find Work</Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://static.vecteezy.com/system/resources/previews/000/248/360/non_2x/freelance-online-job-design-concept-freelancer-develops-busines-vector.jpg"
                alt="Freelance Marketplace"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-4 -mt-12 relative z-10">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for skills or services..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <Button className="w-full md:w-auto">Search Jobs</Button>
          </div>
        </div>
      </div>

      {/* Features/Job Categories */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Job Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find work in top industries or hire skilled professionals for your projects</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Web Development", description: "Frontend, Backend, Full Stack", count: "1,240+ jobs available" },
              { title: "Design & Creative", description: "UI/UX, Graphic Design, Branding", count: "840+ jobs available" },
              { title: "Writing & Translation", description: "Content, Technical, Localization", count: "620+ jobs available" },
              { title: "Marketing", description: "Social Media, SEO, Content Marketing", count: "450+ jobs available" },
              { title: "Video & Animation", description: "Editing, Motion Graphics, 3D", count: "380+ jobs available" },
              { title: "Business & Finance", description: "Accounting, Consulting, Analysis", count: "290+ jobs available" }
            ].map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm text-gray-500">{category.count}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How FreelanceHub Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Simple steps to start working with top talent or find your next project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
              <p className="text-gray-600">Create a detailed job listing to attract the perfect freelancer for your project</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Review Proposals</h3>
              <p className="text-gray-600">Compare bids, portfolios, and reviews to find the best talent for your needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate & Pay</h3>
              <p className="text-gray-600">Work together on our secure platform with protected payments and messaging</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

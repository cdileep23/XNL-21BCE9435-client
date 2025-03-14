import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';


const FApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:7000/job/applications/me',{withCredentials:true});
      setApplications(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load applications');
      setIsLoading(false);
      console.error('Error fetching applications:', err);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge color based on bid status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-900 rounded-full animate-spin"></div>
            <p className="ml-4 text-gray-700">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Applications Found</h2>
            <p className="text-gray-600">You haven't applied to any jobs yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
      <Link to="/freelancer" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={18} />
        <span>My Applications</span>
      </Link>
      
        
        <div className="grid grid-cols-1 gap-6">
          {applications.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">{job.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Bid Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.myBid.status)}`}>
                      {job.myBid.status.charAt(0).toUpperCase() + job.myBid.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Job Description</h3>
                    <p className="text-gray-700">{job.description}</p>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Skills Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">My Bid Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="text-lg font-semibold text-blue-900">₹{job.myBid.amount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Delivery Time</p>
                          <p className="text-lg font-semibold text-gray-800">{job.myBid.deliveryTime} days</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="text-lg font-semibold text-gray-800">₹{job.budget}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Submitted On</p>
                          <p className="text-sm font-medium text-gray-700">{formatDate(job.myBid.submittedAt)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Posted By</h3>
                      <p className="text-gray-700">{job.jobPoster.fullName}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                        <p className="text-gray-700">{formatDate(job.deadline)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Job Status</h3>
                        <span className="px-3 py-1 rounded-full text-sm font-medium capitalize bg-gray-100">
                          {job.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FApplications;
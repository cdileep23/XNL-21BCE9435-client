import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const JobPoster = () => {
  const [jobs, setJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [pendingBids, setPendingBids] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch all jobs created by this user
      const jobsResponse = await axios.get('http://localhost:7000/job/posted/me', {
        withCredentials: true
      });
      
      const jobsData = jobsResponse.data;
      setJobs(jobsData);
      
      // Calculate stats from the retrieved jobs
      setActiveJobs(jobsData.filter(job => job.status === 'open' || job.status === 'in-progress').length);
      setCompletedJobs(jobsData.filter(job => job.status === 'completed').length);
      
      // Calculate pending bids correctly
      let totalPendingBids = 0;
      jobsData.forEach(job => {
        // Check if bids exists and is an array before trying to filter
        if (Array.isArray(job.bids)) {
          const pendingBidsForJob = job.bids.filter(bid => bid.status === 'pending').length;
          totalPendingBids += pendingBidsForJob;
        }
      });
      
      setPendingBids(totalPendingBids);
      
      try {
        const userResponse = await axios.get('http://localhost:7000/user/profile', {
          withCredentials: true
        });
        setTotalSpent(userResponse.data.moneySpent || 0);
      } catch (profileErr) {
        console.error('Error fetching profile data:', profileErr);
        setTotalSpent(0);
        toast.error('Could not fetch spending information');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching job poster data:', err);
      setError('Failed to load dashboard data. Please try again later.');
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchData();
  };

  // Function to safely get bid count for a job
  const getBidCount = (job) => {
    if (!job.bids) return 0;
    if (!Array.isArray(job.bids)) return 0;
    return job.bids.length;
  };

  // Function to safely get pending bid count for a job
  const getPendingBidCount = (job) => {
    if (!job.bids) return 0;
    if (!Array.isArray(job.bids)) return 0;
    return job.bids.filter(bid => bid.status === 'pending').length;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p>{error}</p>
            <Button onClick={retryFetch}>Retry</Button>
          </CardContent>
        </Card>
        <Toaster position="bottom-center" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="bottom-center" />
      
      <h1 className="text-3xl font-bold mb-8">Job Poster Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
            <p className="text-3xl font-bold">{activeJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Completed Jobs</h3>
            <p className="text-3xl font-bold">{completedJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
            <p className="text-3xl font-bold">${typeof totalSpent === 'number' ? totalSpent.toFixed(2) : '0.00'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Bids</h3>
            <p className="text-3xl font-bold">{pendingBids}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Jobs */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center p-6">
              <p className="mb-4">No jobs posted yet.</p>
              <Button asChild>
                <Link to="/jobs/new">Create your first job</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Budget</th>
                    <th className="text-left py-3 px-4">Deadline</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">All Bids</th>
                    <th className="text-left py-3 px-4">Pending Bids</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice(0, 5).map(job => (
                    <tr key={job._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{job.title}</td>
                      <td className="py-3 px-4">${job.budget}</td>
                      <td className="py-3 px-4">{new Date(job.deadline).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          job.status === 'open' ? 'bg-green-100 text-green-800' : 
                          job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getBidCount(job)}</td>
                      <td className="py-3 px-4">
                        {getPendingBidCount(job) > 0 ? (
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">
                            {getPendingBidCount(job)}
                          </span>
                        ) : (
                          <span>0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/jobs/${job._id}`}>View</Link>
                        </Button>
                        {job.status === 'open' && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/jobs/${job._id}/edit`}>Edit</Link>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {jobs.length > 5 && (
            <div className="mt-4 text-right">
              <Button variant="link" asChild>
                <Link to="/jobs">View All Jobs</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/jobs/new">Post New Job</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/freelancers">Find Freelancers</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/chat">Messages</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobPoster;
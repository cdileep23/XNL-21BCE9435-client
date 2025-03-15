import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import CreateJobDialog from "@/components/createNewJob";
import { BASE_URL } from "@/utils/url";


const JobPoster = () => {
  const [jobs, setJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false); // State for dialog visibility

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      // Fetch all jobs created by this user
      const jobsResponse = await axios.get(
        `${BASE_URL}/job/posted/me`,
        {
          withCredentials: true,
        }
      );

      const jobsData = jobsResponse.data;
      setJobs(jobsData);

      // Calculate total pages
      setTotalPages(Math.ceil(jobsData.length / jobsPerPage));

      // Calculate stats from the retrieved jobs
      setActiveJobs(
        jobsData.filter(
          (job) => job.status === "open" || job.status === "in-progress"
        ).length
      );
      setCompletedJobs(
        jobsData.filter((job) => job.status === "completed").length
      );

      try {
        const userResponse = await axios.get(
          `${BASE_URL}/user/profile`,
          {
            withCredentials: true,
          }
        );
        setTotalSpent(userResponse.data.moneySpent || 0);
      } catch (profileErr) {
        console.error("Error fetching profile data:", profileErr);
        setTotalSpent(0);
        toast.error("Could not fetch spending information");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching job poster data:", err);
      setError("Failed to load dashboard data. Please try again later.");
      toast.error("Failed to load dashboard data");
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

  // Function to handle job creation
  const handleJobCreated = () => {
    fetchData(); // Refresh all data after creating a job
  };

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Function to get formatted deadline date
  const formatDeadline = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

      {/* Create Job Dialog */}
      <CreateJobDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onJobCreated={handleJobCreated} 
      />

      <h1 className="text-3xl font-bold mb-8">Job Poster Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
            <p className="text-3xl font-bold">{activeJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">
              Completed Jobs
            </h3>
            <p className="text-3xl font-bold">{completedJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
            <p className="text-3xl font-bold flex items-center">
              <IndianRupee size={25} />
              {typeof totalSpent === "number" ? totalSpent.toFixed(2) : "0.00"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All Jobs with Pagination */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Jobs</CardTitle>
          <Button onClick={() => setCreateDialogOpen(true)}>
            Post New Job
          </Button>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center p-6">
              <p className="mb-4">No jobs posted yet.</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                Create your first job
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Budget</th>
                      <th className="text-left py-3 px-4">Deadline</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Skills Required</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentJobs.map((job) => (
                      <tr key={job._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{job.title}</td>
                        <td className="py-3 px-4 flex items-center">
                          <IndianRupee size={12} />
                          {job.budget}
                        </td>
                        <td className="py-3 px-4">
                          {formatDeadline(job.deadline)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {job.skillsRequired &&
                              job.skillsRequired
                                .slice(0, 2)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                  >
                                    {skill}
                                  </span>
                                ))}
                            {job.skillsRequired &&
                              job.skillsRequired.length > 2 && (
                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                  +{job.skillsRequired.length - 2}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/jobs/${job._id}`}>
                              View {job.status === "open" && "/ Edit"}
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstJob + 1} to{" "}
                  {Math.min(indexOfLastJob, jobs.length)} of {jobs.length} jobs
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>

                  <div className="flex items-center">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageToShow;
                      if (totalPages <= 5) {
                        pageToShow = i + 1;
                      } else if (currentPage <= 3) {
                        pageToShow = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageToShow = totalPages - 4 + i;
                      } else {
                        pageToShow = currentPage - 2 + i;
                      }

                      if (pageToShow <= totalPages) {
                        return (
                          <Button
                            key={pageToShow}
                            variant={
                              currentPage === pageToShow ? "default" : "outline"
                            }
                            size="sm"
                            className="mx-1 h-8 w-8 p-0"
                            onClick={() => paginate(pageToShow)}
                          >
                            {pageToShow}
                          </Button>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
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
            <Button onClick={() => setCreateDialogOpen(true)}>
              Post New Job
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
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  ExternalLink,
  ArrowLeft,
  FileText,
  User,
  Zap,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { toast } from "sonner";

const EachJobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('7');
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [bidOpen, setBidOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:7000/job/${jobId}`, {
          withCredentials: true
        });
        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.response?.data?.message || 'Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setBidSubmitting(true);
    
    try {
      // Using the correct endpoint and field names as per your backend
      const response = await axios.post(`http://localhost:7000/job/${jobId}/apply`, {
        amount: Number(amount),
        deliveryTime: Number(deliveryTime),
        proposal
      }, {
        withCredentials: true
      });
      
      setBidSuccess(true);
      
      // Show success and close dialog after delay
      setTimeout(() => {
        setBidOpen(false);
        setBidSuccess(false);
        toast.success("Bid Submitted Successfully", {
          description: "The client will review your proposal.",
          duration: 5000,
        });
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          (err.response?.data?.errors && err.response.data.errors[0]?.msg) || 
                          'Failed to submit bid. Please try again.';
      
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setBidSubmitting(false);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Calculate days remaining until deadline
  const calculateDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const differenceInTime = deadlineDate.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    return differenceInDays > 0 ? differenceInDays : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center space-x-2 mb-6">
          <ArrowLeft size={18} />
          <span>Back to Jobs</span>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link to="/freelancer" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={18} />
        <span>Back to Jobs</span>
      </Link>
      
      {job && (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <User size={16} className="mr-2" />
              <span>Posted by {job.jobPoster.fullName}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-muted-foreground">
                    <span className="mr-2">₹</span>
                    <span>Budget</span>
                  </div>
                  <p className="font-bold text-lg">₹{job.budget.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar size={18} className="mr-2" />
                    <span>Deadline</span>
                  </div>
                  <p className="font-bold text-lg">{formatDate(job.deadline)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-muted-foreground">
                    <Clock size={18} className="mr-2" />
                    <span>Time Left</span>
                  </div>
                  <p className="font-bold text-lg">
                    {calculateDaysRemaining(job.deadline)} Days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{job.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Dialog open={bidOpen} onOpenChange={setBidOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="px-8">
                  <Zap size={16} className="mr-2" />
                  Place Bid
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Submit Your Bid</DialogTitle>
                  <DialogDescription>
                    Make an offer for "{job.title}"
                  </DialogDescription>
                </DialogHeader>
                
                {bidSuccess ? (
                  <div className="py-6 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Bid Submitted Successfully!</h3>
                    <p className="mt-2 text-sm text-gray-500">The client will review your proposal and get back to you.</p>
                    <p className="mt-1 text-sm text-gray-500">You will be able to chat with the client once they accept your bid.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitBid} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Your Bid Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        max={job.budget}
                        required
                        placeholder="Enter your bid amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Client's budget: ₹{job.budget}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTime">Delivery Time (Days)</Label>
                      <Input
                        id="deliveryTime"
                        type="number"
                        min="1"
                        required
                        placeholder="How many days you need"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="proposal">Proposal</Label>
                      <Textarea
                        id="proposal"
                        required
                        placeholder="Explain why you're the best fit for this job"
                        rows={6}
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setBidOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={bidSubmitting}>
                        {bidSubmitting ? "Submitting..." : "Submit Bid"}
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default EachJobApplication;
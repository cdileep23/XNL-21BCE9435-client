import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BidsForEachJob from '@/components/BidsForEachJob';
import { IndianRupee, X, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

// MarkAsCompletedDialog Component
const MarkAsCompletedDialog = ({ 
  isOpen, 
  onClose, 
  jobId, 
  onJobCompleted 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const response = await axios.patch(
        `http://localhost:7000/job/${jobId}/complete`,
        { feedback }, // Optionally send feedback to backend
        { withCredentials: true }
      );
      
      // Call the callback to update parent state
      onJobCompleted();
      
      // Close dialog
      onClose();
      
      toast.success('Job marked as completed and payment processed');
    } catch (err) {
      console.error('Error marking job as completed:', err);
      toast.error(err.response?.data?.message || 'Failed to complete job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <CheckCircle className="text-green-500" size={24} />
            Mark Job as Completed
          </DialogTitle>
          <DialogDescription>
            This will finalize the job, process payment to the freelancer, and close the job.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="feedback" className="text-sm font-medium text-gray-700">
                Completion Feedback (Optional)
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any feedback about the completed work..."
              ></textarea>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md mt-2">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> Marking a job as completed will:
              </p>
              <ul className="list-disc ml-5 mt-2 text-yellow-800 text-sm">
                <li>Process payment to the freelancer</li>
                <li>Change job status to "completed"</li>
                <li>Finalize the contract between both parties</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Complete Job'}
              {!isSubmitting && <CheckCircle size={18} />}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EachJobAdmin = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams();
  
  // State for edit dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skillsRequired: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for completion dialog
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:7000/job/${jobId}`, {withCredentials: true});
      setJob(response.data);
      
      // Initialize edit form data
      const deadlineDate = new Date(response.data.deadline);
      setEditFormData({
        title: response.data.title,
        description: response.data.description,
        budget: response.data.budget,
        deadline: deadlineDate.toISOString().split('T')[0], // Format for date input
        skillsRequired: response.data.skillsRequired.join(', ')
      });
      
      setLoading(false);
    } catch (err) {
      const errorMessage = 'Failed to load job details';
      setError(errorMessage);
      setLoading(false);
      console.error('Error fetching job:', err);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  // Function to handle job status updates from BidsForEachJob component
  const handleJobStatusUpdate = (newStatus) => {
    setJob(prevJob => ({
      ...prevJob,
      status: newStatus
    }));
  };

  // Function to handle closing a job
  const handleCloseJob = async () => {
    try {
      const res = await axios.patch(`http://localhost:7000/job/${jobId}/close`, {}, {
        withCredentials: true
      });
      console.log(res);
  
      setJob(prevJob => ({
        ...prevJob,
        status: 'closed'
      }));
  
      toast.success('Job closed successfully');
    } catch (err) {
      console.error('Error closing job:', err);
      toast.error(err.response?.data?.message || 'Failed to close job');
    }
  };
  
  // Handle edit form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to submit job updates
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Convert skills string to array
      const skillsArray = editFormData.skillsRequired
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill !== '');
      
      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        budget: parseFloat(editFormData.budget),
        deadline: new Date(editFormData.deadline).toISOString(),
        skillsRequired: skillsArray
      };
      
      const response = await axios.patch(
        `http://localhost:7000/job/update/${jobId}`, 
        updateData, 
        { withCredentials: true }
      );
      
      // Update job state with new data
      setJob(response.data);
      
      // Close dialog and show success message
      setShowEditDialog(false);
      toast.success('Job updated successfully');
    } catch (err) {
      console.error('Error updating job:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update job';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading job details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Job not found</div>
      </div>
    );
  }

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg my-8">
   
      
      {/* Header with Status Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
        <div className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium ${
          job.status === 'open' ? 'bg-green-100 text-green-800' : 
          job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
          job.status === 'completed' ? 'bg-purple-100 text-purple-800' :
          job.status === 'closed' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Description</h2>
          <p className="text-gray-600">{job.description}</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Budget</h2>
            <p className="text-gray-600 flex items-center gap-1">
              <IndianRupee className="text-gray-700" size={18} />
              {job.budget.toLocaleString()}
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Deadline</h2>
            <p className="text-gray-600">{formatDate(job.deadline)}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Posted By</h2>
            <p className="text-gray-600">{job.jobPoster.fullName}</p>
            <p className="text-gray-500 text-sm">{job.jobPoster.email}</p>
          </div>
        </div>
      </div>

      {/* Skills Required */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Skills Required</h2>
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired.map((skill, index) => (
            <span 
              key={index} 
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Timestamps */}
      <div className="border-t pt-4 mt-6 text-sm text-gray-500 flex justify-between">
        <div>Created: {formatDate(job.createdAt)}</div>
        <div>Last Updated: {formatDate(job.updatedAt)}</div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        {job.status === 'open' && (
          <button 
            onClick={() => setShowEditDialog(true)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
          >
            Edit Job
          </button>
        )}
        {job.status === 'open' && (
          <button 
            onClick={handleCloseJob}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition-colors"
          >
            Close Job
          </button>
        )}
        {job.status === 'in-progress' && (
          <button 
            onClick={() => setShowCompletionDialog(true)}
            className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md transition-colors"
          >
            Mark as Completed
          </button>
        )}
      </div>
      {/* After the existing dialogs, add this line */}
<MarkAsCompletedDialog 
  isOpen={showCompletionDialog} 
  onClose={() => setShowCompletionDialog(false)} 
  jobId={jobId} 
  onJobCompleted={() => {
    setJob(prevJob => ({
      ...prevJob,
      status: 'completed'
    }));
  }} 
/>
      
      {/* Bids Component - passing the job status update handler */}
      <BidsForEachJob jobId={jobId} onJobStatusUpdate={handleJobStatusUpdate} />

      {/* Edit Job Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Edit Job</DialogTitle>
            <DialogDescription>
              Make changes to the job details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateJob} className="py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="budget" className="text-sm font-medium text-gray-700">
                  Budget
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={editFormData.budget}
                    onChange={handleEditFormChange}
                    className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="deadline" className="text-sm font-medium text-gray-700">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={editFormData.deadline}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="skillsRequired" className="text-sm font-medium text-gray-700">
                  Skills Required (comma separated)
                </label>
                <input
                  type="text"
                  id="skillsRequired"
                  name="skillsRequired"
                  value={editFormData.skillsRequired}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="React, Node.js, MongoDB"
                  required
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </DialogClose>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Job'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EachJobAdmin;
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { BASE_URL } from '@/utils/url';

const MarkAsCompletedDialog = ({ 
  isOpen, 
  onClose, 
  jobId, 
  onJobCompleted 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const response = await axios.pach(
        `${BASE_URL}/job/${jobId}/complete`,
        {}, // Empty object since no feedback is needed
        { withCredentials: true }
      );
      console.log(response);
      
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

export default MarkAsCompletedDialog;
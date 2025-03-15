import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { IndianRupee } from 'lucide-react';
import { BASE_URL } from '@/utils/url';

const BidsForEachJob = ({ jobId, onJobStatusUpdate }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBids, setTotalBids] = useState(0);
  const bidsPerPage = 5;

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/job/${jobId}/bids?page=${currentPage}&limit=${bidsPerPage}&sort=-createdAt`, 
          { withCredentials: true }
        );
        
        if (response.data.bids) {
          // If API returns paginated format
          setBids(response.data.bids);
          setTotalBids(response.data.total);
        } else {
          // If API returns direct array
          setBids(response.data);
          setTotalBids(response.data.length);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bids:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load bids';
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      }
    };

    fetchBids();
  }, [jobId, currentPage]);

  const handleAcceptBid = async (bidId) => {
    if (actionInProgress) return;
    
    setActionInProgress(true);
    try {
      // Updated endpoint to match the API
      const res = await axios.patch(`${BASE_URL}/bids/${bidId}/accept`, {}, {
        withCredentials: true
      });
      console.log(res);
      
      // Update UI to reflect the accepted bid and set all other bids to rejected
      setBids(prevBids => 
        prevBids.map(bid => ({
          ...bid,
          status: bid._id === bidId ? 'accepted' : 'rejected'
        }))
      );
      
      // Notify parent component about job status change to 'in-progress'
      if (onJobStatusUpdate) {
        onJobStatusUpdate('in-progress');
      }
      
      toast.success('Bid accepted successfully');
    } catch (err) {
      console.error('Error accepting bid:', err);
      const errorMessage = err.response?.data?.message || 'Failed to accept bid';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleRejectBid = async (bidId) => {
    console.log(bidId);
    if (actionInProgress) return;
    
    setActionInProgress(true);
    try {
      // Updated endpoint to match the API
      const res = await axios.patch(`${BASE_URL}/bids/${bidId}/reject`, {}, {
        withCredentials: true
      });
      
      console.log(res);
      // Update UI to reflect the rejected bid
      setBids(prevBids => 
        prevBids.map(bid => ({
          ...bid,
          status: bid._id === bidId ? 'rejected' : bid.status
        }))
      );
      
      toast.success('Bid rejected successfully');
    } catch (err) {
      console.error('Error rejecting bid:', err);
      const errorMessage = err.response?.data?.message || 'Failed to reject bid';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActionInProgress(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalBids / bidsPerPage);

  // Navigate to a specific page
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold">Loading bids...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">No Bids Available</h2>
        <p className="text-gray-600">This job hasn't received any bids yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6">Bids for this Job</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Freelancer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposed Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bids.map((bid) => (
                <tr key={bid._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {bid.freelancer.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bid.freelancer.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {bid.freelancer.skills && bid.freelancer.skills.slice(0, 3).join(", ")}
                          {bid.freelancer.skills && bid.freelancer.skills.length > 3 && "..."}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <IndianRupee className="inline-block" size={16} />
                      {bid.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bid.deliveryTime} days</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        bid.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {bid.status?.charAt(0).toUpperCase() + bid.status?.slice(1) || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {bid.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptBid(bid._id)}
                            disabled={actionInProgress}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid._id)}
                            disabled={actionInProgress}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {bid.status !== 'pending' && (
                        <span className="text-gray-500 italic">
                          {bid.status === 'accepted' ? 'Accepted' : 'Rejected'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * bidsPerPage) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * bidsPerPage, totalBids)}
                  </span> of{' '}
                  <span className="font-medium">{totalBids}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  
                  {/* Page Numbers */}
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      onClick={() => goToPage(number + 1)}
                      className={`relative inline-flex items-center px-4 py-2
                        ${(number + 1) === currentPage
                          ? 'bg-blue-50 border-blue-500 text-blue-600' 
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} 
                        text-sm font-medium`}
                    >
                      {number + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidsForEachJob;
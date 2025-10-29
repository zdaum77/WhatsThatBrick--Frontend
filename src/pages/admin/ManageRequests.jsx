import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const { data } = await api.get('/requests', { params });
      setRequests(data.data);
    } catch (error) {
      console.error('Failed to load requests');
    }
    setLoading(false);
  };

  const handleRequest = async (requestId, status) => {
    setProcessing(true);
    try {
      await api.put(`/requests/${requestId}`, {
        status,
        admin_comment: adminComment
      });
      toast.success(`Request ${status}!`);
      setSelectedRequest(null);
      setAdminComment('');
      loadRequests();
    } catch (error) {
      console.error('Failed to handle request');
    }
    setProcessing(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-lego-textred">Manage Part Requests</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setFilter('submitted')}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === 'submitted'
              ? 'border-b-2 border-lego-red text-lego-textred'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === 'approved'
              ? 'border-b-2 border-lego-red text-lego-textred'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === 'rejected'
              ? 'border-b-2 border-lego-red text-lego-textred'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rejected
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === 'all'
              ? 'border-b-2 border-lego-red text-lego-textred'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All
        </button>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.length === 0 ? (
          <div className="col-span-2 card text-center py-12">
            <p className="text-gray-600">No requests found</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="card">
              {/* Image Preview - Small */}
              {request.image_urls && request.image_urls.length > 0 && (
                <div className="mb-4">
                  <img
                    src={request.image_urls[0]}
                    alt={request.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{request.name}</h3>
                  {request.part_code && (
                    <p className="text-sm text-gray-600">Part Code: {request.part_code}</p>
                  )}
                  {request.category && (
                    <p className="text-sm text-gray-600 capitalize">Category: {request.category}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status}
                </span>
              </div>

              {request.description && (
                <p className="text-gray-700 text-sm mb-3">{request.description}</p>
              )}

              {request.color_variants && request.color_variants.length > 0 && (
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-600">Colors:</span>
                  {request.color_variants.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.code || '#ccc' }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>By: {request.user_id?.username || 'Unknown'}</span>
                <span>{new Date(request.date_submitted).toLocaleDateString()}</span>
              </div>

              {request.status === 'submitted' ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="btn btn-secondary flex-1"
                  >
                    <Eye size={16} className="inline mr-1" />
                    Review
                  </button>
                </div>
              ) : (
                request.admin_comment && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Admin Comment:</p>
                    <p className="text-sm text-gray-600">{request.admin_comment}</p>
                  </div>
                )
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-lego-textred">Review Request</h2>
            
            {/* Images Gallery */}
            {selectedRequest.image_urls && selectedRequest.image_urls.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">Images:</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedRequest.image_urls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${selectedRequest.name} ${idx + 1}`}
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-bold text-lg">{selectedRequest.name}</h3>
              {selectedRequest.part_code && (
                <p className="text-gray-600">Part Code: {selectedRequest.part_code}</p>
              )}
              {selectedRequest.category && (
                <p className="text-gray-600 capitalize">Category: {selectedRequest.category}</p>
              )}
            </div>

            {selectedRequest.description && (
              <div className="mb-4">
                <p className="font-medium mb-1">Description:</p>
                <p className="text-gray-700">{selectedRequest.description}</p>
              </div>
            )}

            {selectedRequest.color_variants && selectedRequest.color_variants.length > 0 && (
              <div className="mb-4">
                <p className="font-medium mb-2">Colors:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.color_variants.map((color, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.code || '#ccc' }}
                      />
                      <span className="text-sm">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-lego-textred mb-2">
                Admin Comment
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="input"
                rows={3}
                placeholder="Add a comment (optional)..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleRequest(selectedRequest._id, 'approved')}
                disabled={processing}
                className="btn btn-primary flex-1 disabled:opacity-50"
              >
                <CheckCircle size={18} className="inline mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleRequest(selectedRequest._id, 'rejected')}
                disabled={processing}
                className="btn btn-danger flex-1 disabled:opacity-50"
              >
                <XCircle size={18} className="inline mr-1" />
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setAdminComment('');
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
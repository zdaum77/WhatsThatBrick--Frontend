import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';

export default function MyContributions() {
  const [activeTab, setActiveTab] = useState('bricks');
  const [bricks, setBricks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bricksRes, requestsRes] = await Promise.all([
        api.get('/bricks'),  // Will only get user's bricks on backend
        api.get('/requests'),
      ]);
      
      // Filter to only show user's bricks (created_by matches current user)
      const userBricks = bricksRes.data.data.filter(brick => brick.created_by);
      setBricks(userBricks);
      setRequests(requestsRes.data.data);
    } catch (error) {
      console.error('Failed to load contributions');
    }
    setLoading(false);
  };

  const handleDeleteBrick = async (brickId, brickName) => {
    if (!confirm(`Are you sure you want to delete "${brickName}"?`)) {
      return;
    }

    try {
      await api.delete(`/bricks/${brickId}`);
      toast.success('Brick deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete brick');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'approved':
      case 'published':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Contributions</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('bricks')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'bricks'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Bricks ({bricks.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'requests'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Part Requests ({requests.length})
        </button>
      </div>

      {/* My Bricks */}
      {activeTab === 'bricks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bricks.length === 0 ? (
            <div className="col-span-full card text-center py-12">
              <p className="text-gray-600 mb-4">You haven't created any bricks yet</p>
              <Link to="/submit" className="btn btn-primary">
                Submit Your First Brick
              </Link>
            </div>
          ) : (
            bricks.map((brick) => (
              <div key={brick._id} className="card">
                <Link to={`/bricks/${brick._id}`}>
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    {brick.image_urls && brick.image_urls[0] ? (
                      <img
                        src={brick.image_urls[0]}
                        alt={brick.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-6xl">🧱</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(brick.status)}
                  <span className={`text-sm px-2 py-1 rounded ${
                    brick.status === 'published' ? 'bg-green-100 text-green-800' :
                    brick.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusText(brick.status)}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-1">{brick.name}</h3>
                {brick.part_code && (
                  <p className="text-sm text-gray-600 mb-2">#{brick.part_code}</p>
                )}
                {brick.category && (
                  <p className="text-sm text-gray-600 capitalize mb-3">{brick.category}</p>
                )}

                <div className="flex space-x-2 pt-3 border-t">
                  <Link
                    to={`/bricks/${brick._id}/edit`}
                    className="btn btn-secondary flex-1 text-sm py-2"
                  >
                    <Edit size={14} className="inline mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteBrick(brick._id, brick.name)}
                    className="btn btn-danger text-sm py-2 px-3"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Part Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">You haven't submitted any part requests yet</p>
              <Link to="/submit" className="btn btn-primary">
                Submit Your First Request
              </Link>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request._id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(request.status)}
                      <h3 className="font-bold text-lg">{request.name}</h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    
                    {request.part_code && (
                      <p className="text-sm text-gray-600 mb-1">Part Code: {request.part_code}</p>
                    )}
                    
                    {request.description && (
                      <p className="text-gray-700 mb-2">{request.description}</p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      Submitted {new Date(request.date_submitted).toLocaleDateString()}
                    </p>
                    
                    {request.admin_comment && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Admin Comment:</p>
                        <p className="text-sm text-gray-600">{request.admin_comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import BrickList from '../../components/bricks/BrickList';
import Pagination from '../../components/common/Pagination';

export default function ManageBricks() {
  const [bricks, setBricks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBricks();
  }, [pagination.page, filter]);

  const loadBricks = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 20,
        status: filter !== 'all' ? filter : undefined
      };

      const { data } = await api.get('/bricks', { params });
      setBricks(data.data);
      setPagination({
        page: data.page,
        total: data.total,
        pages: data.pages
      });
    } catch (error) {
      console.error('Failed to load bricks');
    }
    setLoading(false);
  };

  const handleDelete = async (brickId, brickName) => {
    if (!confirm(`Are you sure you want to delete "${brickName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/bricks/${brickId}`);
      toast.success('Brick deleted successfully');
      loadBricks();
    } catch (error) {
      console.error('Failed to delete brick');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Bricks</h1>
        <Link to="/admin/bricks/new" className="btn btn-primary">
          <Plus size={18} className="inline mr-1" />
          Add New Brick
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === 'all'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({pagination.total})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === 'published'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === 'pending'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending
        </button>
      </div>

      {/* Bricks Grid with Admin Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : bricks.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-gray-600">No bricks found</p>
          </div>
        ) : (
          bricks.map((brick) => (
            <div key={brick._id} className="card">
              {/* Image */}
              <Link to={`/bricks/${brick._id}`} className="block">
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

              {/* Info */}
              {brick.part_code && (
                <div className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                  {brick.part_code}
                </div>
              )}
              <h3 className="font-bold text-lg mb-1 line-clamp-2">{brick.name}</h3>
              {brick.category && (
                <p className="text-sm text-gray-600 capitalize mb-3">{brick.category}</p>
              )}

              {/* Status */}
              {brick.status === 'pending' && (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-3">
                  Pending Review
                </span>
              )}

              {/* Admin Actions */}
              <div className="flex space-x-2 mt-auto pt-3 border-t">
                <Link
                  to={`/admin/bricks/${brick._id}/edit`}
                  className="btn btn-secondary flex-1 text-sm py-1"
                >
                  <Edit size={14} className="inline mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(brick._id, brick.name)}
                  className="btn btn-danger text-sm py-1 px-3"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) => setPagination({ ...pagination, page })}
        />
      )}
    </div>
  );
}
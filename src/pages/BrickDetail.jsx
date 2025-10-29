import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Edit, Trash2, Calendar } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { toast } from 'react-toastify';

export default function BrickDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [brick, setBrick] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    loadBrick();
    if (user) {
      checkFavourite();
    }
  }, [id, user]);

  const loadBrick = async () => {
    try {
      const { data } = await api.get(`/bricks/${id}`);
      setBrick(data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load brick');
    }
    setLoading(false);
  };

  const checkFavourite = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setIsFavourite(data.favourites?.includes(id) || false);
    } catch (error) {
      console.error('Failed to check favourite status');
    }
  };

  const toggleFavourite = async () => {
    try {
      if (isFavourite) {
        await api.delete(`/users/me/favourites/${id}`);
        toast.success('Removed from favourites');
        setIsFavourite(false);
      } else {
        await api.post(`/users/me/favourites/${id}`);
        toast.success('Added to favourites');
        setIsFavourite(true);
      }
    } catch (error) {
      console.error('Failed to toggle favourite');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this brick? This cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/bricks/${id}`);
      toast.success('Brick deleted successfully');
      navigate('/search');
    } catch (error) {
      toast.error('Failed to delete brick');
    }
  };

  // Check if current user can edit/delete (owner or admin)
  const canEditDelete = user && (
    isAdmin || 
    (brick?.created_by?._id === user.id || brick?.created_by === user.id)
  );

  if (loading) return <Loading />;
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <ErrorMessage message={error} />
    </div>
  );
  if (!brick) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {brick.image_urls && brick.image_urls[0] ? (
              <img
                src={brick.image_urls[0]}
                alt={brick.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-9xl">🧱</span>
              </div>
            )}
          </div>

          {/* Additional Images */}
          {brick.image_urls && brick.image_urls.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {brick.image_urls.slice(1, 5).map((url, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={url} alt={`${brick.name} ${index + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div>
          {/* Part Code */}
          {brick.part_code && (
            <div className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded mb-4">
              Part #{brick.part_code}
            </div>
          )}

          {/* Name */}
          <h1 className="text-4xl font-bold mb-4">{brick.name}</h1>

          {/* Category */}
          {brick.category && (
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <span className="font-medium">Category:</span>
              <span className="capitalize">{brick.category}</span>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6 pb-6 border-b">
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{new Date(brick.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            {user && (
              <button 
                onClick={toggleFavourite}
                className={`btn ${isFavourite ? 'btn-primary' : 'btn-secondary'} flex items-center space-x-2`}
              >
                <Heart size={18} fill={isFavourite ? 'currentColor' : 'none'} />
                <span>{isFavourite ? 'Favourited' : 'Add to Favourites'}</span>
              </button>
            )}
            
            {canEditDelete && (
              <>
                <Link 
                  to={`/bricks/${id}/edit`} 
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </Link>
                
                <button 
                  onClick={handleDelete}
                  className="btn btn-danger flex items-center space-x-2"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>

          {/* Description */}
          {brick.description && (
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-2">Description</h2>
              <p className="text-gray-700">{brick.description}</p>
            </div>
          )}

          {/* Color Variants */}
          {brick.color_variants && brick.color_variants.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3">Available Colors</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {brick.color_variants.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color.code || '#ccc' }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Set Appearances */}
          {brick.set_appearances && brick.set_appearances.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3">Appears In Sets</h2>
              <div className="space-y-2">
                {brick.set_appearances.map((set, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{set.set_name}</p>
                      {set.set_id && (
                        <p className="text-sm text-gray-600">Set #{set.set_id}</p>
                      )}
                    </div>
                    {set.year && (
                      <span className="text-sm text-gray-600">{set.year}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dimensions */}
          {brick.dimensions && (
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-2">Dimensions</h2>
              <div className="grid grid-cols-3 gap-4">
                {brick.dimensions.length && (
                  <div>
                    <p className="text-sm text-gray-600">Length</p>
                    <p className="font-medium">{brick.dimensions.length}</p>
                  </div>
                )}
                {brick.dimensions.width && (
                  <div>
                    <p className="text-sm text-gray-600">Width</p>
                    <p className="font-medium">{brick.dimensions.width}</p>
                  </div>
                )}
                {brick.dimensions.height && (
                  <div>
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="font-medium">{brick.dimensions.height}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
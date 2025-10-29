import { useState, useEffect } from 'react';
import api from '../api/axios';
import BrickList from '../components/bricks/BrickList';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.favourites && data.favourites.length > 0) {
        // Fetch bricks and handle missing ones
        const brickPromises = data.favourites.map(id => 
          api.get(`/bricks/${id}`).catch(() => null) // Return null if brick not found
        );
        const brickResults = await Promise.all(brickPromises);
        
        // Filter out null results (deleted bricks)
        const validBricks = brickResults
          .filter(res => res !== null)
          .map(res => res.data);
        
        setFavourites(validBricks);
        
        // If some bricks were deleted, show message
        const deletedCount = data.favourites.length - validBricks.length;
        if (deletedCount > 0) {
          toast.info(`${deletedCount} brick(s) no longer exist and were removed from favourites`);
        }
      }
    } catch (error) {
      console.error('Failed to load favourites');
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-lego-textred">My Favourites</h1>
        <p className="text-gray-600">
          {favourites.length} brick{favourites.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {favourites.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">You haven't added any favourites yet</p>
          <a href="/search" className="btn btn-primary">
            Browse Catalog
          </a>
        </div>
      ) : (
        <BrickList bricks={favourites} loading={false} />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import BrickList from '../components/bricks/BrickList';
import BrickFilters from '../components/bricks/BrickFilters';
import Pagination from '../components/common/Pagination';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bricks, setBricks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    color: searchParams.get('color') || '',
    sort: searchParams.get('sort') || '-createdAt'
  });

  useEffect(() => {
    loadBricks();
  }, [filters, pagination.page]);

  const loadBricks = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: 20
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
    
    // Update URL params
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) params.set(key, newFilters[key]);
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-lego-textred">Browse Catalog</h1>
        <p className="text-gray-600">
          Explore the {pagination.total.toLocaleString()} LEGO parts in our database
        </p>
      </div>

      {/* THIS IS THE FILTERS COMPONENT */}
      <BrickFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <BrickList bricks={bricks} loading={loading} />

      {!loading && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import api from '../../api/axios';

export default function BrickFilters({ onFilterChange, filters }) {
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/bricks/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  return (
    <div className="card mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center space-x-2 text-gray-700 font-medium mb-4 md:hidden"
      >
        <Filter size={20} />
        <span>Filters</span>
      </button>

      <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="text"
              placeholder="e.g., Red, Blue"
              value={filters.color || ''}
              onChange={(e) => onFilterChange({ ...filters, color: e.target.value })}
              className="input"
            />
          </div>

          {/* sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sort || '-createdAt'}
              onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
              className="input"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="-views">Most Views</option>
            </select>
          </div>

          {/* reset */}
          <div className="flex items-end">
            <button
              onClick={() => onFilterChange({})}
              className="btn btn-secondary w-full"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
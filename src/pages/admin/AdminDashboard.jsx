import { Link } from 'react-router-dom';
import { Package, FileText, Users, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBricks: 0,
    pendingRequests: 0,
    totalUsers: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [bricksRes, requestsRes] = await Promise.all([
        api.get('/bricks?limit=1'),
        api.get('/requests?status=submitted&limit=1')
      ]);
      
      setStats({
        totalBricks: bricksRes.data.total,
        pendingRequests: requestsRes.data.total,
        totalUsers: 0
      });
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid - Remove Pending Edits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Bricks</p>
              <p className="text-3xl font-bold">{stats.totalBricks}</p>
            </div>
            <Package className="text-primary-600" size={40} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pending Requests</p>
              <p className="text-3xl font-bold">{stats.pendingRequests}</p>
            </div>
            <FileText className="text-yellow-600" size={40} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold">-</p>
            </div>
            <Users className="text-green-600" size={40} />
          </div>
        </div>
      </div>

      {/* Quick Actions - Remove Review Edits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/requests" className="card hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-xl mb-2">Manage Requests</h3>
          <p className="text-gray-600 mb-4">
            Review and approve new part submissions from users
          </p>
          <span className="text-primary-600 font-medium">
            {stats.pendingRequests} pending →
          </span>
        </Link>

        <Link to="/admin/bricks" className="card hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-xl mb-2">Manage Bricks</h3>
          <p className="text-gray-600 mb-4">
            Edit, delete, or add new bricks directly to the catalog
          </p>
          <span className="text-primary-600 font-medium">
            View all →
          </span>
        </Link>
      </div>
    </div>
  );
}
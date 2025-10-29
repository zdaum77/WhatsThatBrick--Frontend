import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Search, Bell, User, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      // Refresh count every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const { data } = await api.get("/notifications?read=false&limit=1");
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notification count");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-lego-500  sticky top-0 z-50  ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="/WhatsThatBrick.png"></img>
            </div>
            <span className="text-xl font-bold text-white hover:text-orange-200">
              WhatsThatBrick?
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search bricks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.target.value) {
                    navigate(`/search?q=${e.target.value}`);
                  }
                }}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/search"
              className="hidden md:block text-white hover:text-orange-200"
            >
              Discover
            </Link>

            {user ? (
              <>
                <Link
                  to="/submit"
                  className="hidden md:block text-white hover:text-orange-200"
                >
                  Submit Part
                </Link>

                <Link to="/notifications" className="relative">
                  <Bell
                    className="text-white hover:text-orange-200"
                    size={22}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-lego-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden md:flex items-center space-x-1 text-white hover:text-orange-200"
                  >
                    <Shield size={20} />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-white hover:text-orange-200"
                  >
                    <User size={22} />
                    <span className="hidden md:block">{user.username}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/my-contributions"
                        className="block px-4 py-2 text-black hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Contributions
                      </Link>
                      <Link
                        to="/favourites"
                        className="block px-4 py-2 text-black hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Favourites
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-orange-200"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

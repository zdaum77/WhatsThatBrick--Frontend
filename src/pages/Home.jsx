import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-yellow-200 text-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">What's That Brick?</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            The community-driven LEGO parts catalog. Identify, catalog, and
            share your LEGO brick knowledge with enthusiasts worldwide.
          </p>
          <div className="flex justify-center space-x-4">
<Link to="/search" className="bg-white text-lego-textred px-8 py-3 rounded-lg font-semibold hover:bg-lego-cream border-2 border-white">

              Browse Catalog
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 border-2 border-white"
              >
                Join Community
              </Link>
            )}
          </div>
        </div>
      </div>

 

      {/* CTA */}
      <div className="container bg-lego-100 mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          {isAuthenticated
            ? "Start contributing to the most comprehensive brick catalog online"
            : "Join thousands of LEGO enthusiasts contributing to the most comprehensive brick catalog online"}
        </p>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Create Free Account
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/submit" className="btn btn-primary text-lg px-8 py-3">
            Submit New Part
          </Link>
        )}
      </div>
    </div>
  );
}

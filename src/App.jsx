import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PrivateRoute from "./components/layout/PrivateRoute";

// Pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import BrickEdit from "./pages/BrickEdit";
import BrickDetail from "./pages/BrickDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubmitRequest from "./pages/SubmitRequest";
import MyContributions from "./pages/MyContributions";
import Favourites from "./pages/Favourites";
import Notifications from "./pages/Notifications";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRequests from "./pages/admin/ManageRequests";
import ManageBricks from "./pages/admin/ManageBricks";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/bricks/:id" element={<BrickDetail />} />
              <Route
                path="/bricks/:id/edit"
                element={
                  <PrivateRoute>
                    <BrickEdit />
                  </PrivateRoute>
                }
              />
              <Route path="/bricks/:id" element={<BrickDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/submit"
                element={
                  <PrivateRoute>
                    <SubmitRequest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-contributions"
                element={
                  <PrivateRoute>
                    <MyContributions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favourites"
                element={
                  <PrivateRoute>
                    <Favourites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <ManageRequests />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/bricks"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <ManageBricks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/edits"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <ManageRequests />
                  </PrivateRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                      404 - Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-8">
                      The page you're looking for doesn't exist.
                    </p>
                    <a href="/" className="btn btn-primary">
                      Go Home
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
}

export default App;

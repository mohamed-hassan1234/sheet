import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth, logoutAuth } from "../utils/auth";
import { 
  UserCircle, 
  Mail, 
  Lock, 
  Save, 
  Trash2, 
  LogOut,
  Eye,
  EyeOff,
  Shield,
  Key,
  AlertTriangle
} from "lucide-react";

const API = "https://Al-hafiid.somsoftsystems.com/api";

const TeacherProfile = () => {
  const token = getAuth();
  const [teacher, setTeacher] = useState({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logoutPassword, setLogoutPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLogoutPassword, setShowLogoutPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ================= GET PROFILE =================
  useEffect(() => {
    axios
      .get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTeacher(res.data);
        setFullName(res.data.fullName);
        setEmail(res.data.email);
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err);
      });
  }, [token]);

  // ================= UPDATE =================
  const handleUpdate = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      await axios.put(
        `${API}/auth/me`,
        { fullName, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideIn';
      notification.textContent = 'Profile updated successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
      setPassword("");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideIn';
        notification.textContent = 'Failed to update profile';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (!confirmed) return;

    setLoading(true);
    
    try {
      await axios.delete(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      logoutAuth();
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideIn';
      notification.textContent = 'Account deleted successfully';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Delete failed:", error);
      setLoading(false);
    }
  };

  // ================= LOGOUT WITH PASSWORD =================
  const handleLogout = async () => {
    if (!logoutPassword) {
      alert("Please enter your password to logout");
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(
        `${API}/auth/logout`,
        { password: logoutPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      logoutAuth();
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideIn';
      notification.textContent = 'Logged out successfully';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Logout failed:", error);
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideIn';
      notification.textContent = error.response?.data?.message || 'Logout failed';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#212d63] mb-2">
            Teacher Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#212d63] to-[#87b9ea] flex items-center justify-center mb-4">
                  <UserCircle className="w-20 h-20 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{teacher.fullName || "Loading..."}</h2>
                <p className="text-gray-500">{teacher.email || "Loading..."}</p>
                <div className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  Teacher Account
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>Email verified: {teacher.emailVerified ? "✅" : "❌"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="w-5 h-5 mr-3" />
                  <span>Account created: {new Date(teacher.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Update Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-blue-50 mr-3">
                  <UserCircle className="w-6 h-6 text-[#212d63]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#87b9ea] focus:border-transparent outline-none transition"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#87b9ea] focus:border-transparent outline-none transition"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                    <span className="text-gray-500 font-normal ml-1">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#87b9ea] focus:border-transparent outline-none transition"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#212d63] to-[#87b9ea] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>

            {/* Logout & Delete Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logout Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-blue-50 mr-3">
                    <LogOut className="w-6 h-6 text-[#212d63]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Secure Logout</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showLogoutPassword ? "text" : "password"}
                        value={logoutPassword}
                        onChange={(e) => setLogoutPassword(e.target.value)}
                        className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#87b9ea] focus:border-transparent outline-none transition"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLogoutPassword(!showLogoutPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showLogoutPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 border-2 border-[#212d63] text-[#212d63] py-3 px-4 rounded-lg font-medium hover:bg-[#212d63] hover:text-white transition disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5" />
                    {loading ? "Processing..." : "Logout"}
                  </button>
                </div>
              </div>

              {/* Delete Account Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-red-50 mr-3">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-red-700">Danger Zone</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">
                      Once you delete your account, there is no going back. All your data will be permanently removed.
                    </p>
                  </div>

                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TeacherProfile;
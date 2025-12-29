import React, { useState, useEffect } from "react";
import API from "../services/api";
import { getAuth, logoutAuth } from "../utils/auth";
import { 
  User, Mail, Lock, Edit, Save, X, Trash2, LogOut, 
  Shield, Bell, Key, Camera, CheckCircle, Eye, EyeOff,
  Globe, Smartphone, Calendar, Award
} from "lucide-react";

const AdminProfile = () => {
  const [profile, setProfile] = useState({ 
    fullName: "Admin User", 
    email: "admin@alhafiid.edu",
    role: "Super Administrator",
    joinDate: "2023-08-15",
    lastLogin: "2024-01-15 14:30",
    phone: "+1 (555) 123-4567"
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    securityAlerts: true
  });
  const [activeTab, setActiveTab] = useState("profile");

  const token = getAuth();

  // Fetch admin profile
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile({ 
        ...profile, 
        fullName: res.data.fullName || profile.fullName, 
        email: res.data.email || profile.email 
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdate = async () => {
    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const data = { fullName: profile.fullName, email: profile.email };
      if (password) data.password = password;

      await API.put("/auth/me", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account
  const handleDelete = async () => {
    if (!window.confirm("Are you absolutely sure? This action cannot be undone.")) return;
    try {
      await API.delete("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logoutAuth();
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleLogout = () => {
    logoutAuth();
    window.location.href = "/login";
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#87b9ea]/10 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#212d63] to-[#87b9ea] bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your profile and account preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-[#212d63] to-[#2a3a7a] text-white">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                      <User size={28} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{profile.fullName}</h3>
                    <p className="text-white/80 text-sm">{profile.role}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                {[
                  { id: "profile", label: "Profile", icon: User },
                  { id: "security", label: "Security", icon: Shield },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "preferences", label: "Preferences", icon: Globe }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl mb-2 transition-all duration-300 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-[#87b9ea]/10 to-[#212d63]/10 text-[#212d63] border-l-4 border-[#212d63]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Stats Card */}
            <div className="mt-6 bg-gradient-to-br from-[#212d63] to-[#2a3a7a] rounded-2xl p-5 text-white">
              <h4 className="font-bold mb-4">Account Overview</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Member Since</span>
                  <span className="font-medium">{new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Last Login</span>
                  <span className="font-medium">{profile.lastLogin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Account Status</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Tab Content */}
              {activeTab === "profile" && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                      <p className="text-gray-600 mt-1">Update your personal details</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#87b9ea] to-[#212d63] text-white hover:shadow-lg transition-all duration-300"
                    >
                      {isEditing ? <X size={18} /> : <Edit size={18} />}
                      {isEditing ? "Cancel Edit" : "Edit Profile"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Picture Section */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#212d63] to-[#87b9ea] flex items-center justify-center text-white text-3xl font-bold">
                            {profile.fullName.charAt(0).toUpperCase()}
                          </div>
                          {isEditing && (
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200">
                              <Camera size={18} className="text-[#212d63]" />
                            </button>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">Profile Picture</h4>
                          <p className="text-gray-600 text-sm mt-1">
                            Recommended: Square image, at least 400x400px
                          </p>
                          {isEditing && (
                            <button className="mt-3 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors">
                              Upload New Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <User size={16} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.fullName}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isEditing 
                            ? "border-[#87b9ea] bg-white focus:ring-2 focus:ring-[#87b9ea]/30" 
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none transition-all duration-300`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Mail size={16} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isEditing 
                            ? "border-[#87b9ea] bg-white focus:ring-2 focus:ring-[#87b9ea]/30" 
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none transition-all duration-300`}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Smartphone size={16} />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isEditing 
                            ? "border-[#87b9ea] bg-white focus:ring-2 focus:ring-[#87b9ea]/30" 
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none transition-all duration-300`}
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Award size={16} />
                        Role
                      </label>
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="bg-gradient-to-r from-[#87b9ea]/5 to-transparent p-6 rounded-2xl border border-[#87b9ea]/20">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Key size={20} />
                        Change Password
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-[#87b9ea] focus:ring-2 focus:ring-[#87b9ea]/30 focus:outline-none pr-12"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#212d63]"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm mb-2">Confirm Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-[#87b9ea] focus:ring-2 focus:ring-[#87b9ea]/30 focus:outline-none pr-12"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#212d63]"
                            >
                              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          onClick={handleUpdate}
                          disabled={isLoading || (!password && !confirmPassword)}
                          className="px-6 py-3 bg-gradient-to-r from-[#87b9ea] to-[#212d63] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="p-6 rounded-2xl border border-gray-200">
                      <h3 className="font-bold text-gray-800 mb-4">Two-Factor Authentication</h3>
                      <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                      <button className="px-6 py-2.5 border-2 border-[#212d63] text-[#212d63] hover:bg-[#212d63] hover:text-white rounded-xl transition-all duration-300 font-medium">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {key === 'emailNotifications' && 'Email Notifications'}
                            {key === 'smsNotifications' && 'SMS Notifications'}
                            {key === 'securityAlerts' && 'Security Alerts'}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {key === 'emailNotifications' && 'Receive updates via email'}
                            {key === 'smsNotifications' && 'Get important alerts via SMS'}
                            {key === 'securityAlerts' && 'Notifications about account security'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle(key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-[#87b9ea]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">Account Preferences</h2>
                  <p className="text-gray-600">Customize your account experience and settings.</p>
                  {/* Add more preference options here */}
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="mt-6 bg-gradient-to-r from-red-50 to-red-100/50 rounded-2xl border border-red-200 overflow-hidden">
              <div className="p-6">
                <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                  <Shield size={20} />
                  Danger Zone
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#212d63] text-[#212d63] hover:bg-[#212d63] hover:text-white rounded-xl transition-all duration-300 font-medium"
                  >
                    <LogOut size={18} />
                    Logout from All Devices
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 rounded-xl transition-all duration-300 font-medium"
                  >
                    <Trash2 size={18} />
                    Delete Account Permanently
                  </button>
                </div>
                
                <p className="text-red-600 text-sm mt-4">
                  Note: Account deletion is irreversible. All data will be permanently removed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
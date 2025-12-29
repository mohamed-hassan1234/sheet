import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiUser, 
  FiMail, 
  FiEdit2, 
  FiRefreshCw, 
  FiTrash2, 
  FiPlus, 
  FiSave,
  FiLoader,
  FiUsers,
  FiSearch
} from "react-icons/fi";

const API_BASE = "https://Al-hafiid.somsoftsystems.com/api/teacheers";

const Tea = () => {
  const [teachers, setTeachers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});

  /* ================= FETCH TEACHERS ================= */
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setTeachers(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /* ================= VALIDATE FORM ================= */
  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editId) {
        await axios.put(`${API_BASE}/${editId}`, { fullName, email });
      } else {
        await axios.post(`${API_BASE}/register`, { fullName, email });
      }

      setFullName("");
      setEmail("");
      setEditId(null);
      setFormErrors({});
      fetchTeachers();
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (teacher) => {
    setFullName(teacher.userId.fullName);
    setEmail(teacher.userId.email);
    setEditId(teacher._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchTeachers();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete teacher");
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (id) => {
    if (!window.confirm("Reset password to default (1234)?")) return;
    try {
      await axios.put(`${API_BASE}/${id}/reset-password`);
      alert("Password has been reset to 1234");
    } catch (err) {
      console.error("Reset error:", err);
      alert("Failed to reset password");
    }
  };

  /* ================= FILTER TEACHERS ================= */
  const filteredTeachers = teachers.filter(teacher =>
    teacher.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#212d63] to-[#2c3a8c] shadow-lg">
                <FiUsers className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Teacher Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your teaching staff efficiently
                </p>
              </div>
            </div>
            <div className="hidden md:block px-4 py-2 rounded-lg bg-gradient-to-r from-[#87b9ea] to-[#9ac8f0] text-white font-medium">
              {teachers.length} Teachers
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Teachers</p>
                  <p className="text-2xl font-bold text-[#212d63] mt-1">{teachers.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50">
                  <FiUsers className="text-2xl text-[#87b9ea]" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active</p>
                  <p className="text-2xl font-bold text-[#212d63] mt-1">{teachers.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-50">
                  <FiUser className="text-2xl text-green-500" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">In Edit Mode</p>
                  <p className="text-2xl font-bold text-[#212d63] mt-1">
                    {editId ? "1" : "0"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-50">
                  <FiEdit2 className="text-2xl text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 bg-gradient-to-r from-[#212d63] to-[#2c3a8c]">
            <h2 className="text-xl font-bold text-white flex items-center">
              {editId ? (
                <>
                  <FiEdit2 className="mr-2" /> Edit Teacher
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" /> Add New Teacher
                </>
              )}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2 text-[#87b9ea]" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (formErrors.fullName) setFormErrors({...formErrors, fullName: ""});
                    }}
                    className={`w-full px-4 py-3 pl-11 rounded-xl border ${
                      formErrors.fullName ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#87b9ea] focus:border-transparent transition-all duration-200`}
                  />
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {formErrors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.fullName}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMail className="inline mr-2 text-[#87b9ea]" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="teacher@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) setFormErrors({...formErrors, email: ""});
                    }}
                    className={`w-full px-4 py-3 pl-11 rounded-xl border ${
                      formErrors.email ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#87b9ea] focus:border-transparent transition-all duration-200`}
                  />
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <div className="mb-4 sm:mb-0">
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setFullName("");
                      setEmail("");
                      setFormErrors({});
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-[#212d63] to-[#2c3a8c] hover:from-[#2c3a8c] hover:to-[#212d63] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
              >
                {editId ? (
                  <>
                    <FiSave className="mr-2" /> Update Teacher
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2" /> Add Teacher
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Search and Table Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800">
                All Teachers ({filteredTeachers.length})
              </h2>
              
              <div className="relative w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search teachers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#87b9ea] focus:border-transparent"
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-8">
                      <div className="flex justify-center items-center">
                        <FiLoader className="animate-spin text-3xl text-[#87b9ea] mr-3" />
                        <span className="text-gray-600">Loading teachers...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FiUsers className="text-4xl mb-3 opacity-50" />
                        <p className="text-lg font-medium">No teachers found</p>
                        <p className="text-sm mt-1">
                          {searchTerm ? "Try a different search term" : "Add your first teacher using the form above"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher, index) => (
                    <tr 
                      key={teacher._id} 
                      className={`border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#87b9ea] to-[#9ac8f0] flex items-center justify-center text-white font-semibold mr-3">
                            {teacher.userId.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{teacher.userId.fullName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-600">{teacher.userId.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl flex items-center transition-all duration-200 shadow hover:shadow-md"
                          >
                            <FiEdit2 className="mr-2" /> Edit
                          </button>
                          
                          <button
                            onClick={() => handleResetPassword(teacher._id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-[#87b9ea] hover:from-[#87b9ea] hover:to-blue-600 text-white rounded-xl flex items-center transition-all duration-200 shadow hover:shadow-md"
                          >
                            <FiRefreshCw className="mr-2" /> Reset
                          </button>
                          
                          <button
                            onClick={() => handleDelete(teacher._id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl flex items-center transition-all duration-200 shadow hover:shadow-md"
                          >
                            <FiTrash2 className="mr-2" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Teacher Management System • Powered by <span className="text-[#212d63] font-medium">Your School</span></p>
        </div>
      </div>
    </div>
  );
};

export default Tea;
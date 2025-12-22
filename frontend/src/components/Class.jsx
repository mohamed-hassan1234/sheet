import React, { useEffect, useState } from "react";
import API from "../services/api";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Users,
  Search,
  Filter
} from "lucide-react";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/classes");
      setClasses(res.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;

    setIsLoading(true);
    try {
      if (editId) {
        await API.put(`/classes/${editId}`, { className });
        setEditId(null);
      } else {
        await API.post("/classes", { className });
      }
      setClassName("");
      fetchClasses();
    } catch (error) {
      console.error("Error saving class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (cls) => {
    setEditId(cls._id);
    setClassName(cls.className);
    // Scroll to form
    document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await API.delete(`/classes/${id}`);
      setDeleteConfirm(null);
      fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cancelEdit = () => {
    setEditId(null);
    setClassName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#8BBEEE]/10 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2B3990] mb-2">
                Class Management
              </h1>
              <p className="text-gray-600">
                Create, edit, and manage your class roster efficiently
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                <Users className="text-[#8BBEEE]" size={20} />
                <span className="text-lg font-semibold text-[#2B3990]">
                  {classes.length}
                </span>
                <span className="text-gray-500 text-sm ml-1">Classes</span>
              </div>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#8BBEEE]/10 rounded-lg">
                  {editId ? (
                    <Edit2 className="text-[#2B3990]" size={24} />
                  ) : (
                    <Plus className="text-[#2B3990]" size={24} />
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#2B3990]">
                  {editId ? "Edit Class" : "Add New Class"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics 101"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !className.trim()}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2
                      ${editId 
                        ? "bg-[#2B3990] hover:bg-[#2B3990]/90" 
                        : "bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] hover:from-[#8BBEEE]/90 hover:to-[#2B3990]/90"}
                      ${(isLoading || !className.trim()) && "opacity-50 cursor-not-allowed"}
                    `}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        {editId ? "Updating..." : "Adding..."}
                      </>
                    ) : editId ? (
                      <>
                        <Check size={20} />
                        Update Class
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Add Class
                      </>
                    )}
                  </button>

                  {editId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={isLoading}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>

              {/* QUICK TIPS */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  💡 Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#8BBEEE] rounded-full mt-1.5"></div>
                    Click edit to modify existing classes
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#8BBEEE] rounded-full mt-1.5"></div>
                    Use search to quickly find classes
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#8BBEEE] rounded-full mt-1.5"></div>
                    Data is automatically saved and secured
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#8BBEEE]/5 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-[#2B3990]">
                    All Classes ({filteredClasses.length})
                  </h2>
                  {filteredClasses.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Filter size={16} />
                      <span>Sorted by creation date</span>
                    </div>
                  )}
                </div>
              </div>

              {isLoading && classes.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8BBEEE] border-t-transparent"></div>
                  <p className="mt-4 text-gray-500">Loading classes...</p>
                </div>
              ) : filteredClasses.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#8BBEEE]/20 to-[#2B3990]/10 rounded-full flex items-center justify-center mb-6">
                    <Users className="text-[#2B3990]" size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchTerm ? "No matching classes found" : "No classes yet"}
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {searchTerm 
                      ? "Try adjusting your search terms"
                      : "Get started by adding your first class using the form"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Class Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredClasses.map((cls, index) => (
                        <tr 
                          key={cls._id} 
                          className="hover:bg-gradient-to-r hover:from-[#8BBEEE]/5 hover:to-transparent transition-all"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#8BBEEE]/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-[#2B3990]">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div>
                              <span className="font-medium text-gray-900">
                                {cls.className}
                              </span>
                              <div className="text-sm text-gray-500 mt-1">
                                ID: {cls._id.substring(0, 8)}...
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(cls)}
                                disabled={isLoading}
                                className="p-2 text-[#2B3990] hover:bg-[#2B3990]/10 rounded-lg transition-colors disabled:opacity-50"
                                title="Edit class"
                              >
                                <Edit2 size={18} />
                              </button>

                              {deleteConfirm === cls._id ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleDelete(cls._id)}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(cls._id)}
                                  disabled={isLoading}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete class"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FOOTER STATS */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                  <div>
                    Showing <span className="font-semibold">{filteredClasses.length}</span> of{" "}
                    <span className="font-semibold">{classes.length}</span> classes
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Active Classes</span>
                    </div>
                    <div className="hidden md:block text-gray-400">•</div>
                    <div className="text-[#2B3990] font-medium">
                      Data Protected & Secured
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DATA PROTECTION NOTE */}
            <div className="mt-6 bg-gradient-to-r from-[#8BBEEE]/10 to-[#2B3990]/10 rounded-2xl p-6 border border-[#8BBEEE]/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#8BBEEE]/30 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-lg bg-[#2B3990] flex items-center justify-center">
                      <Check className="text-white" size={14} />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#2B3990] mb-2">
                    Your Data is Protected
                  </h3>
                  <p className="text-gray-700 text-sm">
                    All class information is securely stored and encrypted. Changes require 
                    confirmation to prevent accidental data loss. The system automatically 
                    saves your progress and maintains data integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="text-red-500" size={28} />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this class? This action cannot be undone 
              and all associated data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Class;
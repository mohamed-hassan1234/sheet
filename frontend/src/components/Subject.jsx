import React, { useEffect, useState } from "react";
import API from "../services/api";
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  AcademicCapIcon 
} from "@heroicons/react/24/outline";

const Subject = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await API.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      alert("Failed to load subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      return alert("Please enter a subject name");
    }

    try {
      setSubmitting(true);
      if (editId) {
        await API.put(`/subjects/${editId}`, { subjectName: subjectName.trim() });
      } else {
        await API.post("/subjects/add", { subjectName: subjectName.trim() });
      }

      setSubjectName("");
      setEditId(null);
      fetchSubjects();
    } catch (error) {
      console.error("Error saving subject:", error);
      alert("Failed to save subject. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/subjects/${id}`);
      setDeleteConfirm(null);
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setSubjectName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] rounded-xl shadow-lg">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Subject Management
            </h1>
          </div>
          <p className="text-gray-600 ml-12">
            Manage and organize your academic subjects
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <PlusIcon className="h-5 w-5 text-[#2B3990]" />
                {editId ? "Edit Subject" : "Add New Subject"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent transition-all duration-200"
                    placeholder="Enter subject name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting || !subjectName.trim()}
                    className="flex-1 bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] text-white py-3 px-6 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {editId ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        {editId ? (
                          <>
                            <CheckIcon className="h-5 w-5" />
                            Update Subject
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-5 w-5" />
                            Add Subject
                          </>
                        )}
                      </>
                    )}
                  </button>

                  {editId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={submitting}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Total Subjects</p>
                    <p className="text-2xl font-bold text-[#2B3990]">
                      {subjects.length}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">In Edit Mode</p>
                    <p className="text-2xl font-bold text-[#8BBEEE]">
                      {editId ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Subjects List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="px-6 py-4 bg-gradient-to-r from-[#2B3990] to-[#8BBEEE]">
                <h2 className="text-xl font-bold text-white">
                  Subjects List ({subjects.length})
                </h2>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B3990]"></div>
                  </div>
                ) : subjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                      <AcademicCapIcon className="h-full w-full" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      No subjects found
                    </h3>
                    <p className="text-gray-500">
                      Add your first subject using the form
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                            #
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                            Subject Name
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((s, i) => (
                          <tr
                            key={s._id}
                            className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-150 ${
                              editId === s._id ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {i + 1}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {s.subjectName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  ID: {s._id}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <button
                                  className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => {
                                    setEditId(s._id);
                                    setSubjectName(s.subjectName);
                                  }}
                                  disabled={submitting}
                                  title="Edit subject"
                                >
                                  <PencilSquareIcon className="h-5 w-5" />
                                </button>

                                {deleteConfirm === s._id ? (
                                  <div className="flex gap-2">
                                    <button
                                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center gap-1"
                                      onClick={() => handleDelete(s._id)}
                                      title="Confirm delete"
                                    >
                                      <CheckIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                      onClick={() => setDeleteConfirm(null)}
                                      title="Cancel delete"
                                    >
                                      <XMarkIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setDeleteConfirm(s._id)}
                                    disabled={submitting}
                                    title="Delete subject"
                                  >
                                    <TrashIcon className="h-5 w-5" />
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

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <TrashIcon className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Confirm Delete
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this subject? This action cannot be undone.
                      </p>
                      <div className="flex gap-3 justify-end">
                        <button
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          onClick={() => handleDelete(deleteConfirm)}
                        >
                          Delete Subject
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <h4 className="text-sm font-semibold text-[#2B3990] mb-2">
                    💡 Quick Tips
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Click on a subject's edit icon to modify it</li>
                    <li>• Click delete twice to confirm removal</li>
                    <li>• All data is automatically saved to your database</li>
                    <li>• Use the cancel button to exit edit mode</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Data is securely stored and protected. Total subjects: {subjects.length}
          </p>
          <p className="mt-1">
            Using colors: <span className="text-[#2B3990]">#2B3990</span> and{" "}
            <span className="text-[#8BBEEE]">#8BBEEE</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subject;
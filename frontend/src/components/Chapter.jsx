import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaEdit, FaTrash, FaPlus, FaBook, FaBookOpen, FaSpinner, FaChevronDown, FaChevronUp, FaSave, FaTimes } from "react-icons/fa";

const Chapter = () => {
  const [classes, setClasses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [classId, setClassId] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [subject, setSubject] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(null);

  /* ===================== FETCH CLASSES (Teacher assigned) ===================== */
  const fetchClasses = async () => {
    try {
      const res = await API.get("/teachers/my-classes");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===================== FETCH CHAPTERS ===================== */
  const fetchChapters = async (id) => {
    if (!id) return;
    try {
      const res = await API.get(`/chapters/class/${id}`);
      setChapters(res.data);
      setExpandedChapter(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===================== FETCH SUBJECT BY CLASS ===================== */
  const fetchMySubject = async (classId) => {
    if (!classId) {
      setSubject(null);
      return;
    }
    try {
      const res = await API.get(`/teachers/my-subject/${classId}`);
      setSubject(res.data || null);
    } catch (err) {
      console.error(err);
      setSubject(null);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchChapters(classId);
    fetchMySubject(classId);
  }, [classId]);

  /* ===================== CREATE / UPDATE CHAPTER ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId || !chapterName || !subject) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        // Update
        await API.put(`/chapters/${editId}`, { chapterName });
      } else {
        // Add
        await API.post("/chapters/add", {
          classId,
          subjectId: subject._id,
          chapterName
        });
      }

      setChapterName("");
      setEditId(null);
      fetchChapters(classId);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== DELETE CHAPTER ===================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    try {
      await API.delete(`/chapters/${id}`);
      fetchChapters(classId);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===================== CANCEL EDIT ===================== */
  const handleCancelEdit = () => {
    setEditId(null);
    setChapterName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2B3990] mb-3 flex items-center justify-center gap-3">
            <FaBookOpen className="text-[#8BBEEE]" />
            Chapter Management
          </h1>
          <p className="text-gray-600">Create and manage your course chapters efficiently</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#2B3990] to-[#3A4CA8] p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaBook />
              My Chapters
            </h2>
            <p className="text-blue-100 mt-1">Select a class to view and manage chapters</p>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#8BBEEE] focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                  >
                    <option value="" className="text-gray-400">Choose a class...</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id} className="py-2">
                        {cls.className}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Display */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assigned Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={subject ? subject.subjectName : "No subject assigned"}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-700 outline-none"
                      disabled
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className={`w-3 h-3 rounded-full ${subject ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                  </div>
                </div>

                {/* Chapter Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chapter Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter chapter name..."
                    value={chapterName}
                    onChange={(e) => setChapterName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#8BBEEE] focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading || !classId || !chapterName || !subject}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8BBEEE] to-[#6CA8E3] hover:from-[#7AB0E9] hover:to-[#5C9DE0] text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : editId ? (
                    <>
                      <FaSave />
                      Update Chapter
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Chapter
                    </>
                  )}
                </button>

                {editId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <FaTimes />
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* Stats Card */}
            {classId && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                  <div className="text-sm text-gray-600">Total Chapters</div>
                  <div className="text-2xl font-bold text-[#2B3990]">{chapters.length}</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                  <div className="text-sm text-gray-600">Selected Class</div>
                  <div className="text-xl font-bold text-gray-800">
                    {classes.find(c => c._id === classId)?.className || "N/A"}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                  <div className="text-sm text-gray-600">Subject</div>
                  <div className="text-xl font-bold text-gray-800">
                    {subject ? subject.subjectName : "Not assigned"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chapters List Section */}
          <div className="border-t border-gray-200">
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaBookOpen className="text-[#8BBEEE]" />
                Chapters List
                <span className="ml-2 bg-blue-100 text-[#2B3990] text-sm font-medium px-3 py-1 rounded-full">
                  {chapters.length} items
                </span>
              </h3>

              {!classId ? (
                <div className="text-center py-12">
                  <div className="text-5xl text-gray-300 mb-4">📚</div>
                  <h4 className="text-xl font-semibold text-gray-500 mb-2">No Class Selected</h4>
                  <p className="text-gray-400">Please select a class to view chapters</p>
                </div>
              ) : chapters.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl text-gray-300 mb-4">📖</div>
                  <h4 className="text-xl font-semibold text-gray-500 mb-2">No Chapters Found</h4>
                  <p className="text-gray-400">Start by adding your first chapter above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chapters.map((ch, i) => (
                    <div
                      key={ch._id}
                      className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#8BBEEE] to-[#2B3990] text-white font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">{ch.chapterName}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Subject:</span> {subject?.subjectName || "N/A"}
                              </span>
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Created:</span>{" "}
                                {new Date(ch.createdAt || Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditId(ch._id);
                              setChapterName(ch.chapterName);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded-lg transition-all duration-300"
                          >
                            <FaEdit />
                            Edit
                          </button>

                          <button
                            onClick={() => setExpandedChapter(expandedChapter === ch._id ? null : ch._id)}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300"
                          >
                            {expandedChapter === ch._id ? <FaChevronUp /> : <FaChevronDown />}
                            Details
                          </button>

                          <button
                            onClick={() => handleDelete(ch._id)}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg transition-all duration-300"
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedChapter === ch._id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-2">Chapter Information</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Chapter ID:</span>
                                  <span className="font-mono text-sm text-gray-800">{ch._id.substring(0, 8)}...</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Active
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-2">Quick Actions</h5>
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors">
                                  View Content
                                </button>
                                <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors">
                                  Add Lesson
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            💡 <strong>Tip:</strong> Chapters are organized by class and subject. Make sure you've selected the correct class before adding chapters.
          </p>
          <p className="mt-1">All data is securely protected and synchronized in real-time.</p>
        </div>
      </div>
    </div>
  );
};

export default Chapter;
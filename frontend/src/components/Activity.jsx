import React, { useEffect, useState } from "react";
import API from "../services/api";
import { 
  Trash2, 
  Edit2, 
  Save, 
  PlusCircle, 
  BookOpen, 
  Users, 
  FileText,
  X,
  Loader2
} from "lucide-react";

const Activity = () => {
  const [classes, setClasses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [activities, setActivities] = useState([]);
  const [subject, setSubject] = useState(null);

  const [classId, setClassId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [activityName, setActivityName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Colors from your palette
  const colors = {
    primary: '#2B3990',
    secondary: '#8BBEEE',
    light: '#F8FAFC',
    dark: '#1E293B',
    muted: '#64748B'
  };

  // FETCH CLASSES
  const fetchClasses = async () => {
    try {
      const res = await API.get("/teachers/my-classes");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH CHAPTERS
  const fetchChapters = async (id) => {
    if (!id) return;
    setFormLoading(true);
    try {
      const res = await API.get(`/chapters/class/${id}`);
      setChapters(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  // FETCH SUBJECT
  const fetchMySubject = async (classId) => {
    if (!classId) {
      setSubject(null);
      setSubjectId("");
      return;
    }
    try {
      const res = await API.get(`/teachers/my-subject/${classId}`);
      setSubject(res.data || null);
      setSubjectId(res.data?._id || "");
    } catch (err) {
      console.error(err);
      setSubject(null);
      setSubjectId("");
    }
  };

  // FETCH ACTIVITIES BY CLASS
  const fetchActivitiesByClass = async (classId) => {
    if (!classId) return;
    setLoading(true);
    try {
      const res = await API.get("/activity/my");
      const filtered = res.data.filter(act => act.classId?._id === classId);
      setActivities(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // INIT
  useEffect(() => {
    fetchClasses();
  }, []);

  // ON CLASS CHANGE
  useEffect(() => {
    if (!classId) {
      setChapters([]);
      setActivities([]);
      setChapterId("");
      setSubject(null);
      setSubjectId("");
      return;
    }

    fetchChapters(classId);
    fetchMySubject(classId);
    fetchActivitiesByClass(classId);
    setChapterId("");
  }, [classId]);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId || !chapterId || !activityName || !subjectId) {
      alert("Please fill all fields");
      return;
    }

    setFormLoading(true);
    try {
      if (editId) {
        await API.put(`/activity/${editId}`, { activityName });
      } else {
        await API.post("/activity/add", {
          classId,
          chapterId,
          subjectId,
          activityName
        });
      }
      setActivityName("");
      setEditId(null);
      fetchActivitiesByClass(classId);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    try {
      await API.delete(`/activity/${id}`);
      fetchActivitiesByClass(classId);
    } catch (err) {
      console.error(err);
    }
  };

  // RESET FORM
  const resetForm = () => {
    setEditId(null);
    setActivityName("");
    setChapterId("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary }}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
              Activity Management
            </h1>
          </div>
          <p className="text-gray-600 ml-11">
            Create and manage learning activities for your classes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: colors.primary }}>
                  {editId ? (
                    <>
                      <Edit2 className="w-5 h-5" />
                      Edit Activity
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      Add New Activity
                    </>
                  )}
                </h2>
                {editId && (
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Cancel edit"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Class Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Class
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
                    style={{ 
                      borderColor: colors.secondary,
                      focusBorderColor: colors.primary 
                    }}
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Subject
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                    <span className={`font-medium ${subject ? 'text-gray-900' : 'text-gray-400'}`}>
                      {subject?.subjectName || "Select a class first"}
                    </span>
                  </div>
                </div>

                {/* Chapter Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Chapter
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: colors.secondary,
                      focusBorderColor: colors.primary 
                    }}
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    disabled={!classId || formLoading}
                    required
                  >
                    <option value="">Select a chapter</option>
                    {chapters.map((ch) => (
                      <option key={ch._id} value={ch._id}>
                        {ch.chapterName}
                      </option>
                    ))}
                  </select>
                  {formLoading && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading chapters...
                    </div>
                  )}
                </div>

                {/* Activity Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter activity name"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
                    style={{ 
                      borderColor: colors.secondary,
                      focusBorderColor: colors.primary 
                    }}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: colors.primary,
                    hoverBackgroundColor: colors.secondary 
                  }}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : editId ? (
                    <>
                      <Save className="w-5 h-5" />
                      Update Activity
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      Add Activity
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel - Activities List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: colors.primary }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    My Activities ({activities.length})
                  </h2>
                  {classId && (
                    <span className="text-white/80 text-sm">
                      Class: {classes.find(c => c._id === classId)?.className || 'Selected'}
                    </span>
                  )}
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: colors.secondary }} />
                      <p className="text-gray-500">Loading activities...</p>
                    </div>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.secondary}20` }}>
                      <FileText className="w-8 h-8" style={{ color: colors.secondary }} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {classId 
                        ? "No activities created for this class yet. Add your first activity using the form!"
                        : "Select a class to view and manage activities"}
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activities.map((act, i) => (
                        <tr 
                          key={act._id} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium" style={{ 
                              backgroundColor: `${colors.primary}10`,
                              color: colors.primary 
                            }}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {act.classId?.className}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ 
                              backgroundColor: `${colors.secondary}20`,
                              color: colors.dark 
                            }}>
                              {act.subjectId?.subjectName}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {act.chapterId?.chapterName}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {act.activityName}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditId(act._id);
                                  setActivityName(act.activityName);
                                  setClassId(act.classId?._id);
                                  setChapterId(act.chapterId?._id);
                                  setSubjectId(act.subjectId?._id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="p-2 rounded-lg transition-colors duration-200 hover:shadow-sm flex items-center gap-1"
                                style={{ 
                                  backgroundColor: `${colors.secondary}20`,
                                  color: colors.primary 
                                }}
                                title="Edit activity"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">Edit</span>
                              </button>

                              <button
                                onClick={() => handleDelete(act._id)}
                                className="p-2 rounded-lg transition-colors duration-200 hover:shadow-sm flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100"
                                title="Delete activity"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer Stats */}
              {activities.length > 0 && (
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Showing <span className="font-medium">{activities.length}</span> activities
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
                      Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
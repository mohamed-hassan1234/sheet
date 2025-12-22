import React, { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Users, 
  BookOpen, 
  GraduationCap,
  CheckCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [assignForm, setAssignForm] = useState({
    teacherId: "",
    classId: "",
    subjectId: ""
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    teacher: "",
    class: "",
    subject: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  /* =====================
     FETCH ALL DATA
  ===================== */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [t, c, s, a] = await Promise.all([
        API.get("/teachers"),
        API.get("/classes"),
        API.get("/subjects"),
        API.get("/teachers/assignments")
      ]);

      setTeachers(t.data);
      setClasses(c.data);
      setSubjects(s.data);
      setAssignments(a.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* =====================
     ASSIGN
  ===================== */
  const handleAssign = async () => {
    const { teacherId, classId, subjectId } = assignForm;

    if (!teacherId || !classId || !subjectId) {
      alert("Please select teacher, class & subject");
      return;
    }

    try {
      await API.post("/teachers/assign", assignForm);
      setSuccessMessage("Teacher assigned successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setAssignForm({ teacherId: "", classId: "", subjectId: "" });
      fetchAll();
    } catch (error) {
      alert("Failed to assign. Please try again.");
    }
  };

  /* =====================
     UPDATE
  ===================== */
  const handleUpdate = async (id) => {
    try {
      await API.put(`/teachers/assignments/${id}`, editForm);
      setSuccessMessage("Assignment updated successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditId(null);
      fetchAll();
    } catch (error) {
      alert("Failed to update. Please try again.");
    }
  };

  /* =====================
     DELETE
  ===================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    
    try {
      await API.delete(`/teachers/assignments/${id}`);
      setSuccessMessage("Assignment deleted successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchAll();
    } catch (error) {
      alert("Failed to delete. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const getTeacherName = (teacher) => {
    return teacher?.userId?.fullName || "Unknown Teacher";
  };

  const getClassName = (classId) => {
    return classes.find(c => c._id === classId)?.className || "N/A";
  };

  const getSubjectName = (subjectId) => {
    return subjects.find(s => s._id === subjectId)?.subjectName || "N/A";
  };

  /* =====================
     SEARCH AND FILTER LOGIC
  ===================== */
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const teacherName = getTeacherName(assignment.teacherId).toLowerCase();
      const className = getClassName(assignment.classId?._id).toLowerCase();
      const subjectName = getSubjectName(assignment.subjectId?._id).toLowerCase();
      
      // Search term matching
      const matchesSearch = searchTerm === "" || 
        teacherName.includes(searchTerm.toLowerCase()) ||
        className.includes(searchTerm.toLowerCase()) ||
        subjectName.includes(searchTerm.toLowerCase());

      // Filter matching
      const matchesTeacherFilter = filters.teacher === "" || 
        assignment.teacherId?._id === filters.teacher;
      
      const matchesClassFilter = filters.class === "" || 
        assignment.classId?._id === filters.class;
      
      const matchesSubjectFilter = filters.subject === "" || 
        assignment.subjectId?._id === filters.subject;

      return matchesSearch && matchesTeacherFilter && 
             matchesClassFilter && matchesSubjectFilter;
    });
  }, [assignments, searchTerm, filters, classes, subjects]);

  /* =====================
     SORTING LOGIC
  ===================== */
  const sortedAssignments = useMemo(() => {
    const sortableItems = [...filteredAssignments];
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'teacher':
            aValue = getTeacherName(a.teacherId).toLowerCase();
            bValue = getTeacherName(b.teacherId).toLowerCase();
            break;
          case 'class':
            aValue = getClassName(a.classId?._id).toLowerCase();
            bValue = getClassName(b.classId?._id).toLowerCase();
            break;
          case 'subject':
            aValue = getSubjectName(a.subjectId?._id).toLowerCase();
            bValue = getSubjectName(b.subjectId?._id).toLowerCase();
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [filteredAssignments, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="h-4 w-4" /> 
      : <ChevronDown className="h-4 w-4" />;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      teacher: "",
      class: "",
      subject: ""
    });
  };

  const isFilterActive = () => {
    return searchTerm !== "" || 
           filters.teacher !== "" || 
           filters.class !== "" || 
           filters.subject !== "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B3990]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div className="flex-1">
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B3990]">
              Teacher Management
            </h1>
            <p className="text-gray-600 mt-2">
              Assign teachers to classes and subjects
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Users className="h-5 w-5 text-[#2B3990]" />
              <span className="font-semibold">{teachers.length} Teachers</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <GraduationCap className="h-5 w-5 text-[#2B3990]" />
              <span className="font-semibold">{assignments.length} Assignments</span>
            </div>
          </div>
        </div>

        {/* Assignment Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-[#2B3990] to-[#1E2A78] p-6">
            <div className="flex items-center space-x-3">
              <PlusCircle className="h-8 w-8 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Create New Assignment
              </h2>
            </div>
            <p className="text-blue-100 mt-2">
              Assign teacher to class and subject combination
            </p>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Teacher Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Teacher <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                    value={assignForm.teacherId}
                    onChange={(e) =>
                      setAssignForm({ ...assignForm, teacherId: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-400">
                      Select Teacher
                    </option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id} className="py-2">
                        {getTeacherName(t)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Class Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Class <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                    value={assignForm.classId}
                    onChange={(e) =>
                      setAssignForm({ ...assignForm, classId: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-400">
                      Select Class
                    </option>
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.className}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                    value={assignForm.subjectId}
                    onChange={(e) =>
                      setAssignForm({ ...assignForm, subjectId: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-400">
                      Select Subject
                    </option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.subjectName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assign Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 opacity-0">
                  Action
                </label>
                <button
                  onClick={handleAssign}
                  disabled={!assignForm.teacherId || !assignForm.classId || !assignForm.subjectId}
                  className="w-full bg-gradient-to-r from-[#2B3990] to-[#3B4AB0] text-white rounded-lg px-6 py-3 font-semibold hover:from-[#3B4AB0] hover:to-[#2B3990] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Assign Teacher</span>
                </button>
              </div>
            </div>

            {/* Selected Values Preview */}
            {(assignForm.teacherId || assignForm.classId || assignForm.subjectId) && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-[#2B3990] mb-2">Preview:</p>
                <div className="flex flex-wrap gap-4">
                  {assignForm.teacherId && (
                    <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <Users className="h-4 w-4 text-[#2B3990]" />
                      <span className="text-gray-700">
                        {getTeacherName(teachers.find(t => t._id === assignForm.teacherId))}
                      </span>
                    </div>
                  )}
                  {assignForm.classId && (
                    <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <GraduationCap className="h-4 w-4 text-[#2B3990]" />
                      <span className="text-gray-700">
                        {classes.find(c => c._id === assignForm.classId)?.className}
                      </span>
                    </div>
                  )}
                  {assignForm.subjectId && (
                    <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <BookOpen className="h-4 w-4 text-[#2B3990]" />
                      <span className="text-gray-700">
                        {subjects.find(s => s._id === assignForm.subjectId)?.subjectName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#2B3990]">
                  Current Assignments
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage teacher assignments across classes and subjects
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 md:flex-none md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    showFilters || isFilterActive()
                      ? 'bg-gradient-to-r from-[#2B3990] to-[#3B4AB0] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                  {isFilterActive() && (
                    <span className="h-2 w-2 bg-white rounded-full"></span>
                  )}
                </button>
                
                {isFilterActive() && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6 animate-slide-down">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Teacher
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent transition-all duration-200"
                      value={filters.teacher}
                      onChange={(e) => setFilters({...filters, teacher: e.target.value})}
                    >
                      <option value="">All Teachers</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {getTeacherName(t)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Class
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent transition-all duration-200"
                      value={filters.class}
                      onChange={(e) => setFilters({...filters, class: e.target.value})}
                    >
                      <option value="">All Classes</option>
                      {classes.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.className}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Subject
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent transition-all duration-200"
                      value={filters.subject}
                      onChange={(e) => setFilters({...filters, subject: e.target.value})}
                    >
                      <option value="">All Subjects</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{sortedAssignments.length}</span> of{" "}
                <span className="font-semibold">{assignments.length}</span> assignments
                {isFilterActive() && (
                  <span className="ml-2 text-[#2B3990] font-medium">
                    (Filtered)
                  </span>
                )}
              </div>
              
              {sortedAssignments.length > 0 && (
                <div className="text-sm text-gray-600">
                  Sort by:{" "}
                  <button
                    onClick={() => requestSort('teacher')}
                    className="ml-2 text-[#2B3990] font-medium hover:text-[#1E2A78] transition-colors duration-200"
                  >
                    Teacher {getSortIcon('teacher')}
                  </button>
                  <button
                    onClick={() => requestSort('class')}
                    className="ml-4 text-[#2B3990] font-medium hover:text-[#1E2A78] transition-colors duration-200"
                  >
                    Class {getSortIcon('class')}
                  </button>
                  <button
                    onClick={() => requestSort('subject')}
                    className="ml-4 text-[#2B3990] font-medium hover:text-[#1E2A78] transition-colors duration-200"
                  >
                    Subject {getSortIcon('subject')}
                  </button>
                </div>
              )}
            </div>

            {/* Assignments Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#2B3990] uppercase tracking-wider">
                      #
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#2B3990] uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#2B3990] uppercase tracking-wider">
                      Class
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#2B3990] uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#2B3990] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedAssignments.map((a, i) => (
                    <tr 
                      key={a._id} 
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#2B3990] text-white font-semibold">
                            {i + 1}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-[#8BBEEE] to-[#2B3990] rounded-full flex items-center justify-center text-white font-semibold">
                            {getTeacherName(a.teacherId)?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {getTeacherName(a.teacherId)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {editId === a._id ? (
                          <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent"
                            value={editForm.classId || a.classId?._id}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                classId: e.target.value
                              })
                            }
                          >
                            {classes.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.className}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-[#2B3990] font-medium">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            {a.classId?.className || "N/A"}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {editId === a._id ? (
                          <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent"
                            value={editForm.subjectId || a.subjectId?._id}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                subjectId: e.target.value
                              })
                            }
                          >
                            {subjects.map((s) => (
                              <option key={s._id} value={s._id}>
                                {s.subjectName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                            <BookOpen className="h-4 w-4 mr-2" />
                            {a.subjectId?.subjectName || "N/A"}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {editId === a._id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(a._id)}
                                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm"
                              >
                                <Save className="h-4 w-4" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                              >
                                <X className="h-4 w-4" />
                                <span>Cancel</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditId(a._id);
                                  setEditForm({
                                    classId: a.classId?._id,
                                    subjectId: a.subjectId?._id
                                  });
                                }}
                                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-200 shadow-sm"
                              >
                                <Edit2 className="h-4 w-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(a._id)}
                                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {sortedAssignments.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-[#2B3990]" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {isFilterActive() ? "No matching assignments found" : "No assignments yet"}
                          </h3>
                          <p className="text-gray-500 max-w-md mb-4">
                            {isFilterActive() 
                              ? "Try adjusting your filters or search term"
                              : "Start by creating your first teacher assignment above."
                            }
                          </p>
                          {isFilterActive() && (
                            <button
                              onClick={resetFilters}
                              className="px-4 py-2 bg-gradient-to-r from-[#2B3990] to-[#3B4AB0] text-white rounded-lg hover:from-[#3B4AB0] hover:to-[#2B3990] transition-all duration-200"
                            >
                              Clear All Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-[#2B3990] to-[#3B4AB0] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Teachers</p>
                <p className="text-3xl font-bold mt-2">{teachers.length}</p>
              </div>
              <Users className="h-12 w-12 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#8BBEEE] to-[#6CA8E8] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-50">Total Classes</p>
                <p className="text-3xl font-bold mt-2">{classes.length}</p>
              </div>
              <GraduationCap className="h-12 w-12 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Subjects</p>
                <p className="text-3xl font-bold mt-2">{subjects.length}</p>
              </div>
              <BookOpen className="h-12 w-12 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-down {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        
        select:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(139, 190, 238, 0.2);
        }
        
        tr {
          transition: all 0.2s ease;
        }
        
        input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(139, 190, 238, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Teacher;
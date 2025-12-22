import React, { useEffect, useState } from "react";
import API from "../services/api";
import { 
  Trophy, 
  Award, 
  ChevronRight, 
  User, 
  BookOpen, 
  Calendar, 
  Activity, 
  Star, 
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Clock,
  Users,
  Book
} from "lucide-react";

const Rank = () => {
  const [ranking, setRanking] = useState([]);
  const [selected, setSelected] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch detailed ranking
  const fetchRanking = async () => {
    try {
      setLoading(true);
      const res = await API.get("/ranking/full-detailed");
      setRanking(res.data);
    } catch (err) {
      console.error("Error fetching ranking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const toggleRowExpansion = (teacherId) => {
    setExpandedRows(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedRanking = [...ranking]
    .filter(teacher =>
      searchTerm === '' ||
      teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.classes?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
      teacher.subjects?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="text-[#2B3990]" />
      : <ChevronDown size={14} className="text-[#2B3990]" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8BBEEE] border-t-[#2B3990] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2B3990] font-medium">Loading ranking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] shadow-lg">
                <Trophy className="text-white" size={28} />
              </div>
              <h1 className="text-3xl font-bold text-[#2B3990]">Teacher Excellence Ranking</h1>
            </div>
            <p className="text-gray-600">Track performance and celebrate excellence in teaching</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search teachers, classes, subjects..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BBEEE] focus:border-transparent w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchRanking}
              className="px-4 py-2 bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] text-white rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-[#2B3990]">{ranking.length}</p>
              </div>
              <Users className="text-[#8BBEEE]" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-[#2B3990]">
                  {Math.round(ranking.reduce((acc, t) => acc + t.totalScore, 0) / ranking.length) || 0}
                </p>
              </div>
              <Activity className="text-[#8BBEEE]" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-[#2B3990]">
                  {ranking.reduce((acc, t) => acc + (t.totalActivities || 0), 0)}
                </p>
              </div>
              <BookOpen className="text-[#8BBEEE]" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-[#2B3990]">
                  {Math.round(ranking.reduce((acc, t) => acc + t.attendanceScore, 0) / ranking.length) || 0}%
                </p>
              </div>
              <Calendar className="text-[#8BBEEE]" size={24} />
            </div>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#2B3990] to-[#3B4BAA]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award size={24} />
              Performance Leaderboard
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-100">
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-[#2B3990] cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center gap-1">
                      Rank
                      <SortIcon columnKey="rank" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2B3990]">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      Teacher
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2B3990]">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      Classes
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2B3990]">
                    <div className="flex items-center gap-1">
                      <Book size={16} />
                      Subjects
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-[#2B3990] cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('attendanceScore')}
                  >
                    <div className="flex items-center gap-1">
                      Attendance
                      <SortIcon columnKey="attendanceScore" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-[#2B3990] cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('taskScore')}
                  >
                    <div className="flex items-center gap-1">
                      Activity
                      <SortIcon columnKey="taskScore" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-[#2B3990] cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalScore')}
                  >
                    <div className="flex items-center gap-1">
                      Total Score
                      <SortIcon columnKey="totalScore" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2B3990]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRanking.map((t, index) => (
                  <React.Fragment key={t.teacherId}>
                    <tr 
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                        expandedRows.includes(t.teacherId) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            t.rank <= 3 
                              ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-600'
                              : 'bg-blue-100 text-[#2B3990]'
                          }`}>
                            {t.rank <= 3 && <Star size={12} fill="currentColor" />}
                            {t.rank <= 3 ? '' : t.rank}
                          </div>
                          {t.rank <= 3 && (
                            <div className={`text-sm font-bold ${
                              t.rank === 1 ? 'text-yellow-500' :
                              t.rank === 2 ? 'text-gray-400' :
                              'text-amber-600'
                            }`}>
                              #{t.rank}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] flex items-center justify-center text-white font-bold">
                            {t.teacherName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{t.teacherName}</p>
                            <p className="text-sm text-gray-500">{t.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {t.classes?.slice(0, 3).map((cls, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 bg-blue-100 text-[#2B3990] text-xs rounded-full"
                            >
                              {cls}
                            </span>
                          ))}
                          {t.classes?.length > 3 && (
                            <span className="text-xs text-gray-500">+{t.classes.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {t.subjects?.slice(0, 2).map((sub, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 bg-indigo-100 text-[#2B3990] text-xs rounded-full"
                            >
                              {sub}
                            </span>
                          ))}
                          {t.subjects?.length > 2 && (
                            <span className="text-xs text-gray-500">+{t.subjects.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(t.attendanceScore, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{t.attendanceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{t.taskScore}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-lg text-[#2B3990]">{t.totalScore}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            t.totalScore >= 90 ? 'bg-green-100 text-green-800' :
                            t.totalScore >= 70 ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {t.totalScore >= 90 ? 'Excellent' :
                             t.totalScore >= 70 ? 'Good' :
                             'Average'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(t)}
                            className="px-4 py-2 bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] text-white rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => toggleRowExpansion(t.teacherId)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {expandedRows.includes(t.teacherId) ? 
                              <ChevronUp className="text-[#2B3990]" size={20} /> :
                              <ChevronDown className="text-[#2B3990]" size={20} />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Row for Activities */}
                    {expandedRows.includes(t.teacherId) && (
                      <tr className="bg-blue-50">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="pl-16">
                            <h4 className="font-bold text-[#2B3990] mb-3 flex items-center gap-2">
                              <Activity size={18} />
                              Recent Activities
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {t.activities?.slice(0, 6).map((act, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-gray-900">{act.activityName}</span>
                                    <span className="text-sm font-bold text-[#2B3990]">+{act.score}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 space-y-1">
                                    <p className="flex items-center gap-1">
                                      <Book size={12} />
                                      {act.subjectName} • {act.chapterName}
                                    </p>
                                    <p className="flex items-center gap-1">
                                      <Users size={12} />
                                      {act.className}
                                    </p>
                                    <p className="flex items-center gap-1">
                                      <Clock size={12} />
                                      {new Date(act.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {t.activities?.length > 6 && (
                              <button
                                onClick={() => setSelected(t)}
                                className="mt-4 text-sm text-[#2B3990] hover:text-[#2B3990]/80 font-medium flex items-center gap-1"
                              >
                                View all {t.activities?.length} activities
                                <ChevronRight size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {sortedRanking.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Search className="text-[#2B3990]" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Full Details */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2B3990] to-[#3B4BAA] p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                    {selected.teacherName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-bold text-white">
                        {selected.teacherName}
                      </h3>
                      <span className="px-3 py-1 bg-white/30 text-white rounded-full text-sm font-medium">
                        Rank #{selected.rank}
                      </span>
                    </div>
                    <p className="text-white/90">{selected.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-[#2B3990] mb-3 flex items-center gap-2">
                    <Users size={20} />
                    Classes & Subjects
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Classes Assigned</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.classes?.map((cls, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-[#2B3990] text-sm rounded-full">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Subjects Teaching</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.subjects?.map((sub, idx) => (
                          <span key={idx} className="px-3 py-1 bg-indigo-100 text-[#2B3990] text-sm rounded-full">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <h4 className="font-bold text-[#2B3990] mb-3 flex items-center gap-2">
                    <Activity size={20} />
                    Performance Scores
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700">Attendance</span>
                        <span className="font-bold text-[#2B3990]">{selected.attendanceScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(selected.attendanceScore, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700">Activity Score</span>
                        <span className="font-bold text-[#2B3990]">{selected.taskScore}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((selected.taskScore / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 font-semibold">Total Score</span>
                        <span className="font-bold text-2xl text-[#2B3990]">{selected.totalScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-[#2B3990] mb-3 flex items-center gap-2">
                    <Calendar size={20} />
                    Activity Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Activities</span>
                      <span className="font-bold text-[#2B3990]">{selected.totalActivities || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Average Score/Activity</span>
                      <span className="font-bold text-[#2B3990]">
                        {selected.activities?.length > 0 
                          ? Math.round(selected.activities.reduce((acc, act) => acc + act.score, 0) / selected.activities.length)
                          : 0}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-700 mb-1">Last Activity</p>
                      <p className="font-medium text-[#2B3990]">
                        {selected.lastPostedAt
                          ? new Date(selected.lastPostedAt).toLocaleString()
                          : "No recent activity"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities Timeline */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold text-[#2B3990] mb-6 text-lg flex items-center gap-2">
                  <Clock size={20} />
                  Activity Timeline ({selected.activities?.length || 0} activities)
                </h4>
                <div className="space-y-4">
                  {selected.activities?.map((act, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#8BBEEE] transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] flex items-center justify-center text-white font-bold">
                          +
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-gray-900">{act.activityName}</h5>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                            +{act.score} points
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Book size={14} />
                            <span>{act.subjectName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} />
                            <span>Chapter: {act.chapterName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>Class: {act.className}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                          <Clock size={12} />
                          {new Date(act.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!selected.activities || selected.activities.length === 0) && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Activity className="text-gray-400" size={32} />
                      </div>
                      <p className="text-gray-500">No activities recorded yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add RefreshCw icon component since it was used
const RefreshCw = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export default Rank;
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { 
  FaTrophy, 
  FaCrown, 
  FaUserGraduate, 
  FaChartBar, 
  FaSync, 
  FaShieldAlt,
  FaAward,
  FaCalendarCheck,
  FaTasks,
  FaStar
} from "react-icons/fa";

const Report = () => {
  const [reportData, setReportData] = useState({ 
    topScore: 0, 
    isTie: false, 
    topTeachers: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchBestTeacher = async () => {
    setRefreshing(true);
    setError("");
    try {
      const res = await API.get("/report/best-teacher");
      setReportData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load the best teacher report. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBestTeacher();
  }, []);

  // Animation for trophy glow
  const TrophyIcon = ({ isTie }) => (
    <div className="relative">
      <div className={`absolute inset-0 ${isTie ? 'animate-pulse' : 'animate-ping'} bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-20`}></div>
      <FaTrophy className={`relative ${isTie ? 'text-gray-400' : 'text-yellow-500'} text-4xl md:text-5xl`} />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2B3990]/5 via-white to-[#8BBEEE]/5 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#8BBEEE]/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#2B3990] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-[#2B3990]">Loading Excellence Report</p>
          <p className="mt-2 text-sm text-gray-500">Securely fetching performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B3990]/5 via-white to-[#8BBEEE]/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Security Indicator */}
        <div className="flex justify-end mb-2">
          <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <FaShieldAlt className="text-[#2B3990] mr-2" />
            <span className="text-sm font-medium text-gray-700">Secure Data</span>
            <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Header with gradient */}
        <div className="relative mb-10">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#8BBEEE]/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#2B3990]/10 rounded-full blur-xl"></div>
          
          <div className="relative bg-gradient-to-r from-[#2B3990] to-[#2B3990]/90 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 flex items-center">
                    <FaCrown className="mr-3 text-yellow-400" />
                    Teacher Excellence Report
                  </h1>
                  <p className="text-blue-100/80 max-w-2xl">
                    Recognizing outstanding educators based on comprehensive performance metrics and secure data analysis.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                  <div className="text-3xl md:text-4xl font-black text-white">{reportData.topScore}</div>
                  <div className="text-sm text-blue-100/80 mt-1">Top Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-r-lg shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Top Teachers */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#2B3990] to-[#2B3990]/80 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <FaUserGraduate className="mr-3" />
                    {reportData.isTie ? 'Top Performers (Tie)' : 'Top Performer'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${reportData.isTie ? 'bg-yellow-500/20 text-yellow-200' : 'bg-green-500/20 text-green-200'}`}>
                      {reportData.isTie ? `${reportData.topTeachers.length} Teachers` : 'Champion'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {reportData.topTeachers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-300 text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
                    <p className="text-gray-500">Performance scores are being calculated or no data is available yet.</p>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${reportData.topTeachers.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {reportData.topTeachers.map((teacher, index) => (
                      <div
                        key={teacher.teacherCode || index}
                        className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Corner accent */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#8BBEEE]/10 to-transparent rounded-tr-xl"></div>
                        
                        <div className="flex items-start space-x-4 mb-6">
                          <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${reportData.isTie ? 'bg-gradient-to-br from-gray-400 to-gray-600' : 'bg-gradient-to-br from-yellow-500 to-amber-600'}`}>
                            <TrophyIcon isTie={reportData.isTie} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{teacher.teacherName}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2B3990]/10 text-[#2B3990]">
                                <FaStar className="w-3 h-3 mr-1" />
                                ID: {teacher.teacherCode}
                              </span>
                              {teacher.email && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#8BBEEE]/10 text-[#2B3990]">
                                  {teacher.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Score Display */}
                        <div className="border-t border-gray-100 pt-6">
                          <div className="text-center">
                            <div className="text-5xl font-black bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] bg-clip-text text-transparent mb-2">
                              {teacher.totalScore}
                            </div>
                            <p className="text-sm text-gray-600">
                              Excellence Score • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        {/* Performance Badge */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="flex items-center justify-center">
                            <div className={`px-4 py-2 rounded-lg ${reportData.isTie ? 'bg-gradient-to-r from-gray-600 to-gray-700' : 'bg-gradient-to-r from-amber-500 to-yellow-600'} text-white font-semibold text-sm`}>
                              {reportData.isTie ? 'Tie - Outstanding Performance' : 'Top Performer'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-8">
            {/* Refresh Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FaSync className="mr-2 text-[#2B3990]" />
                Report Actions
              </h3>
              <button
                onClick={fetchBestTeacher}
                disabled={refreshing}
                className="w-full bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {refreshing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSync className="mr-3" />
                    Refresh Report Data
                  </>
                )}
              </button>
              <p className="mt-4 text-sm text-gray-500 text-center">
                Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Methodology Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FaChartBar className="mr-2 text-[#2B3990]" />
                Methodology
              </h3>
              <div className="space-y-4">
                {[
                  { icon: '📊', title: 'Data Sources', desc: 'Attendance & task completion records' },
                  { icon: '⚖️', title: 'Weighting', desc: 'Balanced scoring algorithm' },
                  { icon: '🔄', title: 'Frequency', desc: 'Real-time calculation' },
                  { icon: '🤝', title: 'Tie Handling', desc: 'Multiple teachers recognized' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-gradient-to-br from-[#2B3990] to-[#8BBEEE] rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-2xl mr-3" />
                <h3 className="text-lg font-bold">Data Protection</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Encrypted API communication
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Secure authentication required
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Role-based access control
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Audit log maintained
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-600">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] rounded-lg flex items-center justify-center mr-3">
                <FaAward className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Teacher Excellence System</p>
                <p className="text-sm">Recognizing outstanding educators since {new Date().getFullYear()}</p>
              </div>
            </div>
            <div className="text-sm text-center md:text-right">
              <p>Report generated: {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className="mt-1">All data is protected and confidential</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Report;
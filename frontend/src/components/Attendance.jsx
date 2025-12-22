import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Calendar, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Lock
} from "lucide-react";
import API from "../services/api";

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [canMark, setCanMark] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Time formatting helper
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // =====================
  // CHECK TIME WINDOW
  // =====================
  const checkTimeWindow = () => {
    const now = new Date();
    setCurrentTime(now);
    
    const start = new Date();
    start.setHours(7, 25, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    if (now >= start && now <= end) {
      setCanMark(true);
    } else {
      setCanMark(false);
    }
  };

  useEffect(() => {
    checkTimeWindow();
    const timer = setInterval(checkTimeWindow, 60000);
    return () => clearInterval(timer);
  }, []);

  // =====================
  // MARK ATTENDANCE
  // =====================
  const markAttendance = async () => {
    if (!canMark) {
      setMessage("Attendance can only be marked between 7:25 AM and 12:00 AM ⏰");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await API.post("/attendance/mark");
      setAttendance(res.data);
      setMessage("Attendance marked successfully! 🎉");
    } catch (err) {
      setMessage(err.response?.data?.message || "Attendance already marked for today");
    } finally {
      setLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'excellent': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'good': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'average': return 'bg-gradient-to-r from-orange-500 to-red-500';
      default: return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 md:p-6">
      <div className="relative w-full max-w-2xl">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#8BBEEE] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#2B3990] opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50">
          
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#2B3990] via-[#3A4BA8] to-[#8BBEEE] p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Daily Attendance
                  </h1>
                  <p className="text-white/80 text-sm mt-1">
                    Secure & Automated Tracking System
                  </p>
                </div>
              </div>
              
              {/* Current time display */}
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                <Clock className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 md:p-8">
            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Your attendance data is securely encrypted and protected
              </span>
            </div>

            {/* Message display */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl border ${message.includes("successfully") 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                <div className="flex items-center gap-3">
                  {message.includes("successfully") ? 
                    <CheckCircle className="h-5 w-5 flex-shrink-0" /> : 
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  }
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}

            {/* Attendance card */}
            {attendance ? (
              <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left side - Basic info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-[#2B3990]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-gray-800">{attendance.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-5 w-5 text-[#2B3990]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Marked Time</p>
                        <p className="font-semibold text-gray-800">{attendance.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Status & Score */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Status</p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(attendance.status)}`}>
                        <TrendingUp className="h-4 w-4 text-white" />
                        <span className="font-bold text-white">{attendance.status}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] bg-clip-text text-transparent">
                          {attendance.score}
                        </span>
                        <span className="text-gray-500">/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="mb-8 p-8 text-center bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Attendance Marked Today
                </h3>
                <p className="text-gray-500 text-sm">
                  Mark your attendance to track your daily record
                </p>
              </div>
            )}

            {/* Action section */}
            <div className="space-y-4">
              <button
                onClick={markAttendance}
                disabled={loading || !canMark}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  canMark && !loading
                    ? "bg-gradient-to-r from-[#2B3990] via-[#3A4BA8] to-[#8BBEEE] text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Marking Attendance...</span>
                    </>
                  ) : (
                    <>
                      {canMark ? (
                        <>
                          <CheckCircle className="h-6 w-6" />
                          <span>Mark Attendance Now</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-6 w-6" />
                          <span>Attendance Locked</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </button>

              {/* Time window info */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${canMark ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className={`h-2 w-2 rounded-full ${canMark ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {canMark ? "Attendance window is OPEN" : "Attendance window is CLOSED"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>7:25 AM - 12:00 AM</span>
                </div>
              </div>

              {/* Security info footer */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>End-to-end encrypted</span>
                  </div>
                  <span className="hidden sm:block">•</span>
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Privacy protected</span>
                  </div>
                  <span className="hidden sm:block">•</span>
                  <span>Data secured with AES-256 encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
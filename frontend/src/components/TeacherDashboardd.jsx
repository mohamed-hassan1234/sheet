import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { getAuth } from "../utils/auth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const API = "https://Al-hafiid.somsoftsystems.com/api";

const TeacherDashboardd = () => {
  const token = getAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/teacher/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  // Configure beautiful chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          color: '#1f2937'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(33, 45, 99, 0.9)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        padding: 10,
        cornerRadius: 6
      }
    },
    cutout: '60%'
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(33, 45, 99, 0.9)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        padding: 10,
        cornerRadius: 6
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(135, 185, 234, 0.1)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          color: '#374151'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#87b9ea] border-t-[#212d63] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#212d63] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-[#212d63] mb-2">Unable to load data</h3>
          <p className="text-gray-600 mb-6">Please check your connection and try again</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#212d63] to-[#2d3b8c] text-white font-medium py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Enhanced chart data with beautiful styling
  const attendanceChart = {
    labels: data.attendanceStats?.map(a => a._id) || [],
    datasets: [
      {
        label: "Students",
        data: data.attendanceStats?.map(a => a.total) || [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green - Present
          'rgba(249, 115, 22, 0.8)', // Orange - Late
          'rgba(239, 68, 68, 0.8)', // Red - Absent
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
        ]
      }
    ]
  };

  const rankingChart = {
    labels: ["Attendance", "Tasks"],
    datasets: [
      {
        label: "Score",
        data: [
          data.ranking?.attendanceScore || 0,
          data.ranking?.taskScore || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#212d63] mb-2">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600">Welcome back, {data.teacher.fullName}! Here's your overview.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-[#212d63] to-[#2d3b8c] rounded-2xl shadow-xl p-6 md:p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">My Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[#87b9ea] text-sm mb-1">Full Name</p>
                <p className="text-lg font-semibold">{data.teacher.fullName}</p>
              </div>
              <div>
                <p className="text-[#87b9ea] text-sm mb-1">Email</p>
                <p className="text-lg font-semibold">{data.teacher.email}</p>
              </div>
              <div>
                <p className="text-[#87b9ea] text-sm mb-1">Teacher Code</p>
                <p className="text-lg font-semibold">{data.teacher.teacherCode}</p>
              </div>
              <div>
                <p className="text-[#87b9ea] text-sm mb-1">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${data.teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {data.teacher.status}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{data.summary.activities}</div>
              <p className="text-[#87b9ea]">Total Activities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Attendance Chart Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#212d63]">Attendance Overview</h3>
            <div className="bg-[#212d63]/10 text-[#212d63] px-3 py-1 rounded-full text-sm font-medium">
              {data.attendanceStats?.reduce((sum, a) => sum + a.total, 0) || 0} Total
            </div>
          </div>
          <div className="h-80">
            <Pie data={attendanceChart} options={pieOptions} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {data.attendanceStats?.map((stat, index) => (
              <div key={index} className="text-center p-3 rounded-lg bg-gray-50">
                <div className={`text-xl font-bold mb-1 ${
                  stat._id === 'Present' ? 'text-green-600' :
                  stat._id === 'Late' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {stat.total}
                </div>
                <div className="text-sm text-gray-600">{stat._id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking Chart Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#212d63]">Performance Scores</h3>
            <div className="bg-gradient-to-r from-[#3b82f6] to-[#a855f7] text-white px-3 py-1 rounded-full text-sm font-medium">
              Total: {(data.ranking?.attendanceScore || 0) + (data.ranking?.taskScore || 0)}
            </div>
          </div>
          <div className="h-80">
            <Bar data={rankingChart} options={barOptions} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Attendance Score</p>
                  <p className="text-2xl font-bold text-blue-600">{data.ranking?.attendanceScore || 0}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Task Score</p>
                  <p className="text-2xl font-bold text-purple-600">{data.ranking?.taskScore || 0}</p>
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-[#87b9ea]/20 rounded-xl shadow-md p-6 border border-[#87b9ea]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#212d63] rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">📋</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Activities Completed</p>
              <p className="text-2xl font-bold text-[#212d63]">{data.summary.activities}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-[#87b9ea]/20 rounded-xl shadow-md p-6 border border-[#87b9ea]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#212d63] rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">👥</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-[#212d63]">
                {data.attendanceStats?.reduce((sum, a) => sum + a.total, 0) || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-[#87b9ea]/20 rounded-xl shadow-md p-6 border border-[#87b9ea]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#212d63] rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">⭐</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Performance Rating</p>
              <p className="text-2xl font-bold text-[#212d63]">
                {((data.ranking?.attendanceScore || 0) + (data.ranking?.taskScore || 0)) / 2}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>
    </div>
  );
};

export default TeacherDashboardd;
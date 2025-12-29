import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
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

const AdminDashboard = () => {
  const token = getAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/admin/dashboard`, {
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

  // Enhanced chart configurations
  const attendanceChart = {
    labels: data?.attendanceStats.map(a => {
      const statusMap = {
        'present': 'Present',
        'absent': 'Absent',
        'late': 'Late'
      };
      return statusMap[a._id] || a._id;
    }) || [],
    datasets: [
      {
        label: "Attendance Distribution",
        data: data?.attendanceStats.map(a => a.total) || [],
        backgroundColor: [
          '#22c55e', // Green for present
          '#ef4444', // Red for absent
          '#f97316', // Orange for late
        ],
        borderColor: '#212d63',
        borderWidth: 2,
        hoverBackgroundColor: [
          '#16a34a',
          '#dc2626',
          '#ea580c'
        ]
      }
    ]
  };

  const rankingChart = {
    labels: data?.rankings.map(r => r.teacherName) || [],
    datasets: [
      {
        label: "Teacher Score",
        data: data?.rankings.map(r => r.totalScore) || [],
        backgroundColor: '#87b9ea',
        borderColor: '#212d63',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: '#5a9de3'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#212d63',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#212d63',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 6
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(33, 45, 99, 0.1)'
        },
        ticks: {
          color: '#4b5563'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#4b5563'
        }
      }
    }
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'bottom'
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] to-[#e6f0ff] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#87b9ea] border-t-[#212d63] rounded-full animate-spin"></div>
          <p className="mt-4 text-[#212d63] font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] to-[#e6f0ff] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#212d63]">
          Admin Dashboard
        </h1>
        <p className="text-[#87b9ea] mt-2">Welcome to your analytics dashboard</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Teachers", value: data?.summary.teachers || 0, icon: "👨‍🏫" },
          { label: "Classes", value: data?.summary.classes || 0, icon: "🏫" },
          { label: "Subjects", value: data?.summary.subjects || 0, icon: "📚" },
          { label: "Chapters", value: data?.summary.chapters || 0, icon: "📖" },
          { label: "Activities", value: data?.summary.activities || 0, icon: "🎯" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{item.icon}</span>
              <div className="w-12 h-12 bg-gradient-to-br from-[#212d63] to-[#87b9ea] rounded-full opacity-10"></div>
            </div>
            <h3 className="text-2xl font-bold text-[#212d63] mb-1">{item.value}</h3>
            <p className="text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#212d63] flex items-center">
              <span className="w-3 h-3 bg-[#22c55e] rounded-full mr-3"></span>
              Attendance Distribution
            </h3>
            <div className="px-4 py-2 bg-[#212d63] text-white rounded-full text-sm">
              Real-time
            </div>
          </div>
          <div className="h-80">
            <Pie data={attendanceChart} options={pieOptions} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {data?.attendanceStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-[#212d63]">{stat.total}</div>
                <div className="text-sm text-gray-600 capitalize">{stat._id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#212d63] flex items-center">
              <span className="w-3 h-3 bg-[#87b9ea] rounded-full mr-3"></span>
              Teacher Performance Ranking
            </h3>
            <div className="px-4 py-2 bg-gradient-to-r from-[#212d63] to-[#87b9ea] text-white rounded-full text-sm">
              Top Performers
            </div>
          </div>
          <div className="h-80">
            <Bar data={rankingChart} options={chartOptions} />
          </div>
          <div className="mt-6">
            <h4 className="font-semibold text-[#212d63] mb-3">Top 3 Teachers</h4>
            <div className="space-y-3">
              {data?.rankings.slice(0, 3).map((teacher, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-transparent"
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-[#212d63]">{teacher.teacherName}</span>
                  </div>
                  <span className="font-bold text-[#87b9ea]">{teacher.totalScore} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mt-8 bg-gradient-to-r from-[#212d63] to-[#87b9ea] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{data?.rankings.length || 0}</div>
            <p className="text-blue-100">Total Teachers Ranked</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {data?.attendanceStats.reduce((acc, curr) => acc + curr.total, 0) || 0}
            </div>
            <p className="text-blue-100">Total Attendance Records</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {data?.rankings[0]?.totalScore || 0}
            </div>
            <p className="text-blue-100">Highest Score</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Data updated in real-time • Last refreshed: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
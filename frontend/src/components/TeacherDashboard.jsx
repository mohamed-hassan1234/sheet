import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Users, BookOpen, Calendar, Bell, Search, User, Settings, LogOut, Menu, X, BarChart3, Award, Clock, ChevronRight, MessageSquare, Filter, Download, HelpCircle, Crown, Zap, Target, TrendingUp, Bookmark, FileText, ClipboardCheck, Presentation, GraduationCap, Edit3, Eye } from "lucide-react";
import { useState, useEffect } from "react";

const menu = [
  { name: "Dashboard", path: "/teacher-dash/dash", icon: Home },
  { name: "Activity", path: "/teacher-dash/activity", icon: BarChart3 },
  { name: "Chapter", path: "/teacher-dash/chapter", icon: BookOpen },
  { name: "Attendance", path: "/teacher-dash/attendance", icon: Calendar },
  { name: "Profile", path: "/teacher-dash/teacherprofile", icon: User },
];

const statsData = [
  { label: "Total Students", value: "128", change: "+5 this week", icon: Users, color: "from-[#87b9ea] to-[#212d63]" },
  { label: "Active Classes", value: "4", change: "2 ongoing", icon: BookOpen, color: "from-[#87b9ea] to-[#212d63]" },
  { label: "Attendance Rate", value: "94%", change: "+2.3% this week", icon: Calendar, color: "from-[#87b9ea] to-[#212d63]" },
  { label: "Avg. Score", value: "8.5", change: "Top 10%", icon: Award, color: "from-[#87b9ea] to-[#212d63]" },
];

const recentActivities = [
  { title: "Algebra Lesson", class: "Grade 10-A", time: "2 hours ago", status: "completed", icon: BookOpen },
  { title: "Homework Checked", class: "Grade 9-B", time: "4 hours ago", status: "graded", icon: Edit3 },
  { title: "Parent Meeting", class: "All Classes", time: "Yesterday", status: "scheduled", icon: Users },
  { title: "Test Results", class: "Grade 11-C", time: "2 days ago", status: "published", icon: FileText },
];

const upcomingClasses = [
  { subject: "Mathematics", time: "9:00 AM", class: "Grade 10-A", room: "Room 301", icon: GraduationCap },
  { subject: "Physics", time: "11:00 AM", class: "Grade 11-B", room: "Lab 102", icon: Presentation },
  { subject: "Calculus", time: "2:00 PM", class: "Grade 12-C", room: "Room 305", icon: BookOpen },
];

const TeacherDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  const getPageTitle = () => {
    const currentItem = menu.find(item => item.path === location.pathname);
    return currentItem ? currentItem.name : "Teacher Dashboard";
  };

  const NavItem = ({ item, isSidebarOpen, onCloseMobile }) => {
    const Icon = item.icon;
    
    return (
      <NavLink
        to={item.path}
        end
        onClick={onCloseMobile}
        className={({ isActive }) => {
          const baseClasses = "flex items-center gap-4 px-4 py-3 mb-2 rounded-xl transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] hover:shadow-lg";
          const activeClasses = isActive 
            ? 'bg-gradient-to-r from-[#87b9ea] to-[#212d63] text-white shadow-lg shadow-[#87b9ea]/30' 
            : 'text-white/80 hover:text-white hover:bg-white/5';
          const sidebarClass = !isSidebarOpen ? 'justify-center' : '';
          
          return `${baseClasses} ${activeClasses} ${sidebarClass}`;
        }}
      >
        {({ isActive }) => (
          <>
            <div className={`
              relative z-10 p-2 rounded-lg transition-all duration-300
              ${isActive 
                ? 'bg-white/20' 
                : 'group-hover:bg-white/10'
              }
            `}>
              <Icon size={20} className={isActive ? 'text-white' : 'text-white/80 group-hover:text-white'} />
            </div>
            
            {isSidebarOpen && (
              <>
                <span className="font-medium text-sm relative z-10">{item.name}</span>
                <ChevronRight size={16} className={`
                  ml-auto text-white/40 transform transition-transform duration-300
                  ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}
                `} />
              </>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-[#87b9ea]/5 to-[#212d63]/5">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 rounded-xl bg-gradient-to-r from-[#212d63] to-[#87b9ea] text-white shadow-lg shadow-[#212d63]/30 hover:shadow-[#212d63]/50 transition-all duration-300"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-20'} 
        fixed h-full bg-gradient-to-b from-[#1a2459] via-[#212d63] to-[#2b3a7a]
        transition-all duration-500 ease-out z-40
        shadow-2xl shadow-[#212d63]/30
        ${isMobileSidebarOpen ? 'left-0' : '-left-full lg:left-0'}
        overflow-hidden
      `}>
        
        {/* Sidebar Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#87b9ea]/10 rounded-full blur-3xl"></div>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 relative">
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#87b9ea] to-[#212d63] flex items-center justify-center shadow-lg shadow-[#87b9ea]/30">
                  <GraduationCap size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#87b9ea] bg-clip-text text-transparent">
                    AL-HAFIID
                  </h1>
                  <p className="text-xs text-white/60 mt-1">Teacher Portal</p>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#87b9ea] to-[#212d63] flex items-center justify-center mx-auto shadow-lg shadow-[#87b9ea]/30">
                <GraduationCap size={24} className="text-white" />
              </div>
            )}
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <ChevronRight size={20} className={`text-white/80 transform transition-transform duration-500 ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-white/80" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {menu.map((item, i) => (
            <NavItem 
              key={i} 
              item={item} 
              isSidebarOpen={isSidebarOpen} 
              onCloseMobile={() => setIsMobileSidebarOpen(false)} 
            />
          ))}
        </nav>

        {/* Quick Stats */}
        {isSidebarOpen && (
          <div className="mx-4 mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap size={16} className="text-[#87b9ea]" />
              <h3 className="text-sm font-semibold text-white">Today's Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Classes Today</span>
                <span className="text-sm font-semibold text-white">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Assignments Due</span>
                <span className="text-sm font-semibold text-white">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Pending Grading</span>
                <span className="text-sm font-semibold text-white">12</span>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent">
          <div className={`flex ${isSidebarOpen ? 'items-center gap-3' : 'justify-center'}`}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#87b9ea] to-[#212d63] flex items-center justify-center shadow-lg">
                <User size={18} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#212d63]"></div>
            </div>
            
            {isSidebarOpen && (
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">Sarah Johnson</h4>
                <p className="text-xs text-white/60">Math Teacher</p>
              </div>
            )}
            
            {isSidebarOpen && (
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings size={18} className="text-white/70 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-500 ease-out
        ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}
        min-h-screen overflow-x-hidden
      `}>
        
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 lg:px-8 py-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#212d63] to-[#87b9ea] bg-clip-text text-transparent">
                {getPageTitle()}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students, lessons..."
                  className="w-56 lg:w-64 pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-300/50 focus:outline-none focus:ring-2 focus:ring-[#87b9ea]/30 focus:border-transparent text-sm transition-all duration-300"
                />
              </div>

              <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-all duration-300 relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-300/50">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#87b9ea] to-[#212d63] flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  SJ
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                    <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                      <TrendingUp size={12} />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}/10`}>
                    <stat.icon size={24} className="text-[#212d63]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
                  <button className="text-sm text-[#212d63] hover:text-[#87b9ea] font-medium transition-colors">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200/50 hover:bg-gray-50/50 transition-all duration-300 group">
                      <div className="p-3 rounded-lg bg-[#87b9ea]/10">
                        <activity.icon size={20} className="text-[#212d63]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.class} • {activity.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outlet Content */}
              <div className="mt-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 min-h-[400px]">
                  <Outlet />
                </div>
              </div>
            </div>

            {/* Right Column - Side Content */}
            <div className="space-y-6">
              {/* Upcoming Classes */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Upcoming Classes</h3>
                  <Clock size={18} className="text-[#87b9ea]" />
                </div>
                
                <div className="space-y-4">
                  {upcomingClasses.map((cls, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-[#87b9ea]/5 to-transparent border border-[#87b9ea]/10 group hover:from-[#87b9ea]/10 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#212d63]">
                          <cls.icon size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{cls.subject}</h4>
                          <p className="text-sm text-gray-600">{cls.time} • {cls.class}</p>
                          <p className="text-xs text-[#87b9ea] mt-1">{cls.room}</p>
                        </div>
                        <button className="p-2 hover:bg-[#212d63]/10 rounded-lg transition-colors">
                          <Eye size={16} className="text-[#212d63]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-3 bg-gradient-to-r from-[#87b9ea] to-[#212d63] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#87b9ea]/30 transition-all duration-300">
                  View Full Schedule
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-[#212d63] to-[#87b9ea] rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 flex flex-col items-center gap-2 group">
                    <FileText size={20} className="text-white" />
                    <span className="text-sm font-medium">Create Lesson</span>
                  </button>
                  <button className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 flex flex-col items-center gap-2 group">
                    <ClipboardCheck size={20} className="text-white" />
                    <span className="text-sm font-medium">Mark Attendance</span>
                  </button>
                  <button className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 flex flex-col items-center gap-2 group">
                    <Edit3 size={20} className="text-white" />
                    <span className="text-sm font-medium">Grade Papers</span>
                  </button>
                  <button className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 flex flex-col items-center gap-2 group">
                    <MessageSquare size={20} className="text-white" />
                    <span className="text-sm font-medium">Send Announcement</span>
                  </button>
                </div>
              </div>

              {/* Performance Overview */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Class 10-A</span>
                      <span className="text-sm font-medium text-gray-800">92%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#87b9ea] to-[#212d63] w-11/12"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Class 9-B</span>
                      <span className="text-sm font-medium text-gray-800">88%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#87b9ea] to-[#212d63] w-4/5"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Class 11-C</span>
                      <span className="text-sm font-medium text-gray-800">95%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#87b9ea] to-[#212d63] w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-[#87b9ea]/10 to-transparent rounded-2xl p-6 border border-[#87b9ea]/20">
              <div className="flex items-center gap-3 mb-4">
                <Bookmark size={20} className="text-[#212d63]" />
                <h4 className="font-semibold text-gray-800">Pending Tasks</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Papers to Grade</span>
                  <span className="font-medium text-gray-800">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lessons to Prepare</span>
                  <span className="font-medium text-gray-800">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Parent Meetings</span>
                  <span className="font-medium text-gray-800">2</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#212d63]/10 to-transparent rounded-2xl p-6 border border-[#212d63]/20">
              <div className="flex items-center gap-3 mb-4">
                <Award size={20} className="text-[#212d63]" />
                <h4 className="font-semibold text-gray-800">Achievements</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#87b9ea]/20 flex items-center justify-center">
                    <Award size={14} className="text-[#212d63]" />
                  </div>
                  <span className="text-sm text-gray-800">Top Performer - October</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#87b9ea]/20 flex items-center justify-center">
                    <TrendingUp size={14} className="text-[#212d63]" />
                  </div>
                  <span className="text-sm text-gray-800">Perfect Attendance</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Quick Links</h4>
                <HelpCircle size={18} className="text-[#87b9ea]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700">
                  Resources
                </button>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700">
                  Calendar
                </button>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700">
                  Reports
                </button>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700">
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                © 2024 AL-HAFIID Teacher Portal. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <button className="text-sm text-gray-500 hover:text-[#212d63] transition-colors">
                  Privacy Policy
                </button>
                <button className="text-sm text-gray-500 hover:text-[#212d63] transition-colors">
                  Terms of Service
                </button>
                <button className="text-sm text-gray-500 hover:text-[#212d63] transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-all duration-300"
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
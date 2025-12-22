import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Users, BookOpen, Calendar, Bell, Search, User, Settings, LogOut, Menu, X, BarChart3, Award, Clock, ChevronRight, MessageSquare, Filter, Download, HelpCircle, Crown, Zap, Target, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const menu = [
  { name: "Dashboard", path: "/teacher-dash", icon: Home },
  { name: "Activity", path: "/teacher-dash/activity", icon: BarChart3 },
  { name: "Chapter", path: "/teacher-dash/chapter", icon: BookOpen },
  { name: "Attendance", path: "/teacher-dash/attendance", icon: Calendar },
];

const TeacherDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Get current page title from path
  const getPageTitle = () => {
    const currentItem = menu.find(item => item.path === location.pathname);
    return currentItem ? currentItem.name : "Teacher Dashboard";
  };

  // Navigation item component
  const NavItem = ({ item, isSidebarOpen, onCloseMobile }) => {
    const Icon = item.icon;
    
    return (
      <NavLink
        to={item.path}
        end
        onClick={onCloseMobile}
        className={({ isActive }) => {
          const baseClasses = "flex items-center gap-4 px-4 py-3 mb-2 rounded-2xl transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] hover:shadow-lg";
          const activeClasses = isActive 
            ? 'bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] text-white shadow-xl shadow-[#8BBEEE]/30' 
            : 'text-white/70 hover:text-white hover:bg-white/5';
          const sidebarClass = !isSidebarOpen ? 'justify-center' : '';
          
          return `${baseClasses} ${activeClasses} ${sidebarClass}`;
        }}
      >
        {({ isActive }) => (
          <>
            {/* Active state glow */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#8BBEEE]/20 to-transparent"></div>
            )}
            
            {/* Icon container */}
            <div className={`
              relative z-10 p-2 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-white/20' 
                : 'group-hover:bg-white/10'
              }
            `}>
              <Icon size={22} className={isActive ? 'text-white' : 'text-white/80 group-hover:text-white'} />
            </div>
            
            {isSidebarOpen && (
              <>
                <span className="font-semibold text-sm relative z-10">{item.name}</span>
                <ChevronRight size={16} className={`
                  ml-auto text-white/40 transform transition-transform duration-300
                  ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}
                `} />
              </>
            )}
            
            {/* Hover effect */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#8BBEEE] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 rounded-xl bg-gradient-to-r from-[#2B3990] to-[#4a5dc5] text-white shadow-2xl shadow-[#2B3990]/30 hover:shadow-[#2B3990]/50 transition-all duration-300 backdrop-blur-sm"
      >
        <Menu size={24} />
      </button>

      {/* SIDEBAR - Premium Teacher Design */}
      <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-24'} 
        fixed h-full bg-gradient-to-b from-[#1A2459] via-[#2B3990] to-[#3A4BB5]
        transition-all duration-500 ease-out z-40
        shadow-2xl shadow-[#2B3990]/50
        ${isMobileSidebarOpen ? 'left-0' : '-left-full lg:left-0'}
        overflow-hidden
      `}>
        
        {/* Sidebar Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8BBEEE]/20 rounded-full blur-3xl"></div>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 relative">
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8BBEEE] to-[#2B3990] flex items-center justify-center shadow-lg shadow-[#8BBEEE]/30">
                  <Crown size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-[#8BBEEE] bg-clip-text text-transparent">
                   AL-HAFIID
                  </h1>
                  <p className="text-xs text-white/60 mt-1">Pimary & Secondary School Teacher</p>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8BBEEE] to-[#2B3990] flex items-center justify-center mx-auto shadow-lg shadow-[#8BBEEE]/30">
                <Crown size={28} className="text-white" />
              </div>
            )}
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={20} className={`text-white/80 transform transition-transform duration-500 ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} className="text-white/80" />
            </button>
          </div>
        </div>

        {/* Teacher Quick Stats */}
        {/* {isSidebarOpen && (
          <div className="mx-4 mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap size={18} className="text-[#8BBEEE]" />
              <h3 className="text-sm font-semibold text-white">Today's Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Classes</span>
                <span className="text-sm font-semibold text-white">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Students</span>
                <span className="text-sm font-semibold text-white">128</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Attendance</span>
                <span className="text-sm font-semibold text-emerald-300">94%</span>
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation - Premium */}
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

        {/* Teacher Quick Actions */}
        {/* {isSidebarOpen && (
          <div className="mt-6 mx-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Target size={18} className="text-[#8BBEEE]" />
              <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <button className="w-full py-2 bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[#8BBEEE]/30 transition-all duration-300 hover:scale-[1.02]">
                + New Lesson
              </button>
              <button className="w-full py-2 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
                Mark Attendance
              </button>
            </div>
          </div>
        )} */}

        {/* Teacher Profile in Sidebar */}
        {/* <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent">
          <div className={`flex ${isSidebarOpen ? 'items-center gap-3' : 'justify-center'}`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8BBEEE] to-[#2B3990] flex items-center justify-center shadow-lg relative">
              <User size={20} className="text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1A2459]"></div>
            </div>
            
            {isSidebarOpen && (
              <div className="flex-1">
                <h4 className="text-white font-semibold">Prof. Sarah Johnson</h4>
                <p className="text-xs text-white/60">Mathematics</p>
              </div>
            )}
            
            {isSidebarOpen ? (
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110">
                  <Settings size={18} className="text-white/70 hover:text-white" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110">
                  <LogOut size={18} className="text-white/70 hover:text-white" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <Settings size={18} className="text-white/70" />
                </button>
              </div>
            )}
          </div>
        </div> */}
      </aside>

      {/* MAIN CONTENT - Premium Teacher Portal */}
      <main className={`
        flex-1 transition-all duration-500 ease-out
        ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
        min-h-screen overflow-x-hidden
      `}>
        
        {/* Premium Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm shadow-gray-200/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 lg:px-8 py-4 gap-4">
            {/* Page Title & Breadcrumb */}
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] bg-clip-text text-transparent">
                {getPageTitle()}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home size={14} />
                  <ChevronRight size={12} className="text-gray-400" />
                  <span className="font-medium text-gray-800">Teacher Portal</span>
                  <ChevronRight size={12} className="text-gray-400" />
                  <span className="text-gray-500">{getPageTitle()}</span>
                </div>
              </div>
            </div>

            {/* Premium Search & Actions */}
            <div className="flex items-center gap-4">
              {/* Premium Search */}
              {/* <div className="relative group hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8BBEEE]/10 to-[#2B3990]/10 rounded-2xl blur group-hover:blur-sm transition-all duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search students, lessons..."
                    className="w-56 lg:w-64 pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300/50 focus:outline-none focus:ring-2 focus:ring-[#8BBEEE]/30 focus:border-transparent text-sm transition-all duration-300"
                  />
                </div>
              </div> */}

              {/* Action Buttons */}
              {/* <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-gray-100/80 rounded-xl transition-all duration-300 hover:scale-105 group relative">
                  <Bell size={20} className="text-gray-600 group-hover:text-[#2B3990]" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                <button className="p-2.5 hover:bg-gray-100/80 rounded-xl transition-all duration-300 hover:scale-105 group">
                  <MessageSquare size={20} className="text-gray-600 group-hover:text-[#2B3990]" />
                </button>
                
                <button className="p-2.5 hover:bg-gray-100/80 rounded-xl transition-all duration-300 hover:scale-105 group">
                  <HelpCircle size={20} className="text-gray-600 group-hover:text-[#2B3990]" />
                </button>
              </div> */}

              {/* Teacher Profile */}
              {/* <div className="flex items-center gap-3 pl-4 border-l border-gray-300/50">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8BBEEE] to-[#2B3990] flex items-center justify-center text-white font-bold shadow-lg shadow-[#8BBEEE]/30">
                    SJ
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Clock size={8} className="text-white" />
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-gray-800">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Math Teacher • Online</p>
                </div>
              </div> */}
            </div>
          </div>
        </header>

        {/* Teacher Stats Cards */}
        <div className="p-6">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg shadow-blue-100/50 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">128</p>
                  <p className="text-sm text-emerald-500 mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    +5 this week
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100/50">
                  <Users size={28} className="text-[#2B3990]" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 shadow-lg shadow-indigo-100/50 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Classes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">4</p>
                  <p className="text-sm text-amber-500 mt-1 flex items-center gap-1">
                    <Clock size={14} />
                    2 ongoing
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-100/50">
                  <BookOpen size={28} className="text-[#2B3990]" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">94%</p>
                  <p className="text-sm text-emerald-500 mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    +2.3% this week
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100/50">
                  <Calendar size={28} className="text-[#2B3990]" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-6 shadow-lg shadow-pink-100/50 border border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Score</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">8.5</p>
                  <p className="text-sm text-emerald-500 mt-1 flex items-center gap-1">
                    <Award size={14} />
                    Top 10%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-pink-100/50">
                  <BarChart3 size={28} className="text-[#2B3990]" />
                </div>
              </div>
            </div>
          </div> */}

          {/* Main Content Area */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-xl shadow-gray-200/20 border border-gray-200/30 p-6 lg:p-8 backdrop-blur-sm">
            {/* Content Header */}
            {/* <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Welcome, Professor!</h3>
                <p className="text-gray-600 mt-1">Manage your classes, track attendance, and create lessons</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 flex items-center gap-2">
                  <Filter size={18} />
                  Filter
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] text-white font-medium rounded-xl hover:shadow-xl hover:shadow-[#8BBEEE]/30 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2">
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div> */}

            {/* Outlet Content */}
            <div className="min-h-[500px]">
              <Outlet />
            </div>

            {/* Today's Schedule */}
            {/* <div className="mt-8 pt-8 border-t border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Today's Schedule</h4>
                <button className="text-sm text-[#2B3990] hover:text-[#8BBEEE] font-medium transition-colors">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-xl p-4 border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Algebra 101</p>
                      <p className="text-sm text-gray-600">9:00 AM - 10:30 AM</p>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100/30 rounded-xl p-4 border border-purple-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Calculus</p>
                      <p className="text-sm text-gray-600">11:00 AM - 12:30 PM</p>
                    </div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/30 rounded-xl p-4 border border-emerald-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Geometry</p>
                      <p className="text-sm text-gray-600">2:00 PM - 3:30 PM</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Premium Footer */}
            {/* <div className="mt-12 pt-8 border-t border-gray-200/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  © 2024 EduTeach Teacher Portal. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <button className="text-sm text-gray-500 hover:text-[#2B3990] transition-colors">
                    Support
                  </button>
                  <button className="text-sm text-gray-500 hover:text-[#2B3990] transition-colors">
                    Help Center
                  </button>
                  <button className="text-sm text-gray-500 hover:text-[#2B3990] transition-colors">
                    Contact Admin
                  </button>
                </div>
              </div>
            </div> */}
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
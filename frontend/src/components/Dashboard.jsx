import { NavLink, Outlet } from "react-router-dom";
import { Home, Users, BarChart3, BookOpen, Award, ChevronRight, Menu, X, LogOut, Settings, Bell, Search, Calendar, Download, Filter, MessageSquare, HelpCircle, Crown, Zap, TrendingUp, Target } from "lucide-react";
import { useState } from "react";

const menu = [
  { name: "Dashboard", path: "/dashboard/dashboar", icon: Home },
  { name: "Register Teacher's", path: "/dashboard/tea", icon: Home },
  { name: "Teachers", path: "/dashboard/teacher", icon: Users },
  { name: "Classes", path: "/dashboard/class", icon: BookOpen },
  { name: "Subjects", path: "/dashboard/subject", icon: Award },
  { name: "Reports", path: "/dashboard/report", icon: BarChart3 },


  { name: "Ranks", path: "/dashboard/rank", icon: Award },
  { name: "Profile", path: "/dashboard/profile", icon: Award },
  
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Navigation item component to handle isActive properly
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 rounded-xl bg-gradient-to-r from-[#2B3990] to-[#4a5dc5] text-white shadow-2xl shadow-[#2B3990]/30 hover:shadow-[#2B3990]/50 transition-all duration-300 backdrop-blur-sm"
      >
        <Menu size={24} />
      </button>

      {/* SIDEBAR - Premium Design */}
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
                  <p className="text-xs text-white/60 mt-1">Pimary & Secondary School</p>
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

        {/* Navigation - Premium */}
        <nav className="mt-8 px-4">
          {menu.map((item, i) => (
            <NavItem 
              key={i} 
              item={item} 
              isSidebarOpen={isSidebarOpen} 
              onCloseMobile={() => setIsMobileSidebarOpen(false)} 
            />
          ))}
        </nav>

        {/* Quick Actions */}
        {/* {isSidebarOpen && (
          <div className="mt-8 mx-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap size={18} className="text-[#8BBEEE]" />
              <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
            </div>
            <button className="w-full py-2 bg-gradient-to-r from-[#8BBEEE] to-[#2B3990] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[#8BBEEE]/30 transition-all duration-300 hover:scale-[1.02]">
              + New Course
            </button>
          </div>
        )} */}

        {/* User Profile in Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent">
          <div className={`flex ${isSidebarOpen ? 'items-center gap-3' : 'justify-center'}`}>
            {/* <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8BBEEE] to-[#2B3990] flex items-center justify-center shadow-lg relative">
              <span className="text-white font-bold"></span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1A2459]"></div>
            </div> */}
            
            {/* {isSidebarOpen && (
              <div className="flex-1">
                <h4 className="text-white font-semibold">John Doe</h4>
                <p className="text-xs text-white/60">Admin</p>
              </div>
            )} */}
            
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
        </div>
      </aside>

      {/* MAIN CONTENT - Premium */}
      <main className={`
        flex-1 transition-all duration-500 ease-out
        ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
        min-h-screen overflow-x-hidden
      `}>
        
        {/* Premium Top Bar */}
       

        {/* Premium Content Area */}
        <div className="p-8">
          {/* Welcome Section */}
        

          {/* Main Content Area */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-2xl shadow-gray-200/30 border border-gray-200/50 p-8 backdrop-blur-sm">
            {/* Content Header */}
            {/* <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Dashboard Overview</h3>
                <p className="text-gray-600 mt-1">Manage and monitor your e-learning platform</p>
              </div>
              <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 flex items-center gap-2">
                <Filter size={18} />
                Filters
              </button>
            </div> */}

            {/* Outlet Content */}
            <div className="min-h-[400px]">
              <Outlet />
            </div>

            {/* Premium Footer */}
            {/* <div className="mt-12 pt-8 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  © 2024 EduMaster. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <button className="text-sm text-gray-500 hover:text-[#2B3990] transition-colors">
                    Privacy Policy
                  </button>
                  <button className="text-sm text-gray-500 hover:text-[#2B3990] transition-colors">
                    Terms of Service
                  </button>
                  <button className="text-sm text-gray-500 hover:text-[#2B3990] transition-colors">
                    Support
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

export default Dashboard;
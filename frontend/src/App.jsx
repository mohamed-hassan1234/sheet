import React from 'react'
import Register from './pages/Register'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Class from './components/Class'
import Teacher from './components/Teacher'
import Chapter from './components/Chapter'
import Activity from './components/Activity'
import Attendance from './components/Attendance'
import Rank from './components/Rank'
import Report from './components/Report'
import Dashboard from './components/Dashboard'
import TeacherDashboard from './components/TeacherDashboard'
import Subject from './components/Subject'

const App = () => {
  return (
    
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path='/' element={<Login />} />



     

<Route path='/teacher-dash' element={<TeacherDashboard />} >
 <Route path='chapter' element={<Chapter />} />

      <Route path='activity' element={<Activity />} />

      <Route path='attendance' element={<Attendance />} />
</Route>


      {/* Admin   dashbaord */}
      <Route path='/dashboard' element={<Dashboard />} >

      <Route path='report' element={<Report />} />
      <Route path='teacher' element={<Teacher />} />
      <Route path='class' element={<Class />} />
      <Route path='rank' element={<Rank />} />
      <Route path='subject' element={<Subject />} />
      </Route>
    </Routes>
  )
}

export default App
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import MainPage from './pages/Main/MainPage';
import LoginPage from './pages/Login/LoginPage';

// Import Layouts
import AdminLayout from './pages/Admin/AdminLayout';

// Import Profile 
import UserProfile from './pages/Profiles/UserProfile';

// Import các trang quản lý của ADMIN
import Dashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import ClassManagement from './pages/Admin/ClassManagement';
import GroupManagement from './pages/Admin/GroupManagement';
import MessageManagement from './pages/Admin/MessageManagement';

// Import Layout và các trang của TEACHER
import TeacherLayout from './pages/Teacher/TeacherLayout';
import TeacherManageClasses from './pages/Teacher/ManageClasses/ManageClasses';
import TeacherManageGroups from './pages/Teacher/ManageGroups/ManageGroups';
import TeacherManageTopics from './pages/Teacher/ManageTopics/ManageTopics';

// Import Layout và các trang của STUDENT
import StudentLayout from './pages/Student/StudentLayout';
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentClasses from './pages/Student/StudentClasses';
import StudentClassDetail from './pages/Student/StudentClassDetail';
import StudentGroups from './pages/Student/StudentGroups';
import StudentTasks from './pages/Student/StudentTasks';
import StudentChat from './pages/Student/StudentChat';
import StudentManageGroup from './pages/Student/StudentManageGroup';

function App() {
  return (
    <Router>
      <Routes>
        {/* Tuyến đường trang chủ */}
        <Route path="/" element={<MainPage />} />
        {/* Tuyến đường trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Tuyến đường Teacher */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherManageClasses />} />
          <Route path="classes" element={<TeacherManageClasses />} />
          <Route path="manage-groups" element={<TeacherManageGroups />} />
          <Route path="manage-topics" element={<TeacherManageTopics />} />
        </Route>

        {/* Tuyến đường Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="groups" element={<GroupManagement />} />
          <Route path="messages" element={<MessageManagement />} /> 
          <Route path="profile" element={<UserProfile role="admin" />} />
        </Route>

        {/* Tuyến đường Student */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<UserProfile role="student" />} />
          <Route path="classes" element={<StudentClasses />} />
          <Route path="classes/:classId" element={<StudentClassDetail />} />
          <Route path="groups" element={<StudentGroups />} />
          <Route path="tasks" element={<StudentTasks />} />
          <Route path="chat" element={<StudentChat />} />
          <Route path="manage-group" element={<StudentManageGroup />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;
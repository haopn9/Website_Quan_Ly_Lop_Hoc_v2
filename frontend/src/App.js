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


function App() {
  return (
    <Router>
      <Routes>
        {/* Tuyến đường trang chủ */}
        <Route path="/" element={<MainPage />} />
        {/* Tuyến đường trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

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


      </Routes>
    </Router>
  );
}

export default App;
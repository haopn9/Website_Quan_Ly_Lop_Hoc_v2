import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaChalkboard, FaUsers, FaBook, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import './TeacherLayout.css';

const TeacherLayout = () => {
  return (
    <div className="teacher-layout-container">
      <aside className="sidebar">
        
        {/* Avatar Giảng viên */}
        <div className="sidebar-profile">
          <div className="avatar-circle">
            <img src="https://i.pravatar.cc/150?img=3" alt="Teacher Avatar" />
          </div>
          <h3 className="user-name">Thầy Minh Khang</h3>
          <p className="user-code">GV00123</p>
        </div>

        {/* Menu Giảng viên - chỉ giữ lại chức năng đã hoàn thiện */}
        <ul className="sidebar-menu">
          <li>
            <Link to="/teacher/classes" className="menu-item">
              <FaChalkboard className="menu-icon" /> <span>Quản lý Lớp học</span>
            </Link>
          </li>
          <li>
            <Link to="/teacher/manage-groups" className="menu-item">
              <FaUsers className="menu-icon" /> <span>Quản lý Nhóm</span>
            </Link>
          </li>
          <li>
            <Link to="/teacher/manage-topics" className="menu-item">
              <FaBook className="menu-icon" /> <span>Quản lý Đề tài</span>
            </Link>
          </li>
          <li>
            <Link to="/teacher/tracking" className="menu-item">
              <FaChartLine className="menu-icon" /> <span>Giám sát & Đánh giá</span>
            </Link>
          </li>
          <li>
            <Link to="/login" className="menu-item">
              <FaSignOutAlt className="menu-icon" /> <span>Đăng xuất</span>
            </Link>
          </li>
        </ul>
      </aside>

      <main className="teacher-main-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default TeacherLayout;
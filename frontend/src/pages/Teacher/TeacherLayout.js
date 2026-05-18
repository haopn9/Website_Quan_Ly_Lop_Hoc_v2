import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaChalkboard, FaUsers, FaBook, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import './TeacherLayout.css';
import authService from '../../services/authService';

const TeacherLayout = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!currentUser || currentUser.maVaiTro !== 2) {
      // Nếu chưa đăng nhập hoặc không phải giảng viên, đẩy về trang login
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout();
    navigate('/login');
  };

  // Nếu đang loading để redirect
  if (!currentUser) return null;
  return (
    <div className="teacher-layout-container">
      <aside className="sidebar">
        
        {/* Avatar Giảng viên */}
        <div className="sidebar-profile">
          <div className="avatar-circle">
            <img src={currentUser.anhDaiDien || "https://i.pravatar.cc/150?img=3"} alt="Teacher Avatar" />
          </div>
          <h3 className="user-name">{currentUser.hoTen}</h3>
          <p className="user-code">{currentUser.maSo || currentUser.tenDangNhap}</p>
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
            <a href="#" className="menu-item" onClick={handleLogout}>
              <FaSignOutAlt className="menu-icon" /> <span>Đăng xuất</span>
            </a>
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
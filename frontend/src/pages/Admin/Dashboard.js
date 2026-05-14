// Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, FaChalkboardTeacher, FaUserGraduate, FaBookOpen, 
  FaUsersCog, FaTasks, FaComments, FaArrowUp, FaEye 
} from 'react-icons/fa';
import './styles/Dashboard.css';

const Dashboard = () => {
  // State cho dữ liệu từ database
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalGroups: 0,
    activeGroups: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalMessages: 0,
  });

  const [recentClasses, setRecentClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả lập dữ liệu từ database (sẽ thay bằng API call)
  useEffect(() => {
    // TODO: Gọi API từ backend
    // fetch('/api/admin/dashboard-stats')
    //   .then(res => res.json())
    //   .then(data => setStats(data))
    
    // Dữ liệu mẫu từ database
    setStats({
      totalUsers: 120,      // Tổng từ bảng NguoiDung
      totalTeachers: 3,     // Đếm từ bảng NguoiDung WHERE MaVaiTro = 2
      totalStudents: 100,   // Đếm từ bảng NguoiDung WHERE MaVaiTro = 3
      totalClasses: 3,      // Đếm từ bảng LopHoc
      totalGroups: 9,       // Đếm từ bảng Nhom
      activeGroups: 9,      // Đếm nhóm có sinh viên
      pendingTasks: 15,     // Đếm từ bảng NhiemVu WHERE TrangThai = 'Đang thực hiện'
      overdueTasks: 3,      // Đếm task quá hạn
      totalMessages: 1240,  // Đếm từ bảng TinNhan
    });

    setRecentClasses([
      { id: 1, name: 'Lập trình Web', code: 'LT_WEB_01', teacher: 'Nguyễn Văn A', students: 45, groups: 9, status: 'active' },
      { id: 2, name: 'Cơ sở dữ liệu', code: 'CSDL_01', teacher: 'Trần Thị B', students: 38, groups: 8, status: 'active' },
      { id: 3, name: 'Lập trình Java', code: 'JAVA_01', teacher: 'Lê Hồng C', students: 42, groups: 9, status: 'active' },
    ]);
    
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-state">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="page-header-modern">
        <div className="header-content">
          <h2>Tổng quan hệ thống</h2>
          <p>Chào mừng! Đây là tổng quan về hệ thống quản lý lớp học.</p>
        </div>
      </div>

      {/* Thống kê từ database */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><FaUsers /></div>
          <div className="stat-info">
            <h3>Tổng người dùng</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <span className="stat-change positive"><FaArrowUp /> từ bảng NguoiDung</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FaChalkboardTeacher /></div>
          <div className="stat-info">
            <h3>Giảng viên</h3>
            <p className="stat-number">{stats.totalTeachers}</p>
            <span className="stat-change">MaVaiTro = 2</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><FaUserGraduate /></div>
          <div className="stat-info">
            <h3>Sinh viên</h3>
            <p className="stat-number">{stats.totalStudents}</p>
            <span className="stat-change">MaVaiTro = 3</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><FaBookOpen /></div>
          <div className="stat-info">
            <h3>Lớp học</h3>
            <p className="stat-number">{stats.totalClasses}</p>
            <span className="stat-change">từ bảng LopHoc</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon info"><FaUsersCog /></div>
          <div className="stat-info">
            <h3>Nhóm học tập</h3>
            <p className="stat-number">{stats.totalGroups}</p>
            <span className="stat-change">{stats.activeGroups} nhóm từ bảng Nhom</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning"><FaTasks /></div>
          <div className="stat-info">
            <h3>Công việc</h3>
            <p className="stat-number">{stats.pendingTasks}</p>
            <span className="stat-change negative">{stats.overdueTasks} trễ hạn từ bảng NhiemVu</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger"><FaComments /></div>
          <div className="stat-info">
            <h3>Tin nhắn</h3>
            <p className="stat-number">{stats.totalMessages.toLocaleString()}</p>
            <span className="stat-change">từ bảng TinNhan</span>
          </div>
        </div>
      </div>

      {/* Danh sách lớp học từ bảng LopHoc */}
      <div className="classes-grid-modern">
        {recentClasses.map(classItem => (
          <div key={classItem.id} className="class-card-modern">
            <div className="class-card-header">
              <div className="class-title">
                <h3>{classItem.name}</h3>
                <span className="class-code">{classItem.code}</span>
              </div>
              <span className="status-badge-modern active">
                {classItem.status === 'active' ? 'Đang hoạt động' : 'Kết thúc'}
              </span>
            </div>
            
            <div className="class-card-body">
              <div className="class-info-row">
                <FaChalkboardTeacher className="info-icon" />
                <span>{classItem.teacher}</span>
              </div>
              <div className="class-stats-modern">
                <div className="stat-item">
                  <FaUsers className="stat-icon" />
                  <span>{classItem.students} Sinh viên</span>
                </div>
                <div className="stat-item">
                  <FaUsersCog className="stat-icon" />
                  <span>{classItem.groups} Nhóm</span>
                </div>
              </div>
            </div>
            
            <div className="class-card-footer">
              <Link to={`/admin/classes/${classItem.id}`} className="action-btn view">
                <FaEye /> Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="view-all-container">
        <Link to="/admin/classes" className="btn-view-all">
          Xem tất cả lớp học
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
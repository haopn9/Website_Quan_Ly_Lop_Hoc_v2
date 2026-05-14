import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainPage.css';
import appShowcase from '../../assets/app-showcase.png';

const MainPage = () => {
  const navigate = useNavigate(); // Khởi tạo hàm chuyển trang

  return (
    <div className="main-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Nhóm 2</div>
        <ul className="nav-links">
          <li>Trang chủ</li>
          <li>Giải pháp</li>
          <li>Giới thiệu</li>
        </ul>
        {/* Nối kết sang trang Login */}
        <Link to="/login" className="btn-login-nav">Đăng nhập</Link>
      </nav>

      {/* HERO SECTION */}
      <header className="hero-section">
        <div className="hero-content">
          <span className="badge">Hãy làm việc hiệu quả hơn</span>
          <h1>Quản lý lớp học & nhóm của bạn dễ dàng cùng Nhóm 2</h1>
          <p>Nền tảng tốt nhất để quản lý lớp học và nhóm của bạn tại một nơi duy nhất, dễ dàng và nhanh chóng.</p>

          {/* Nút Bắt đầu ngay đã được gắn link */}
          <button className="btn-get-started" onClick={() => navigate('/login')}>
            Bắt đầu ngay
          </button>
        </div>

        {/* Hình ảnh minh họa giao diện App */}
        <div className="app-preview">
          <img src={appShowcase} alt="Xem trước ứng dụng" />
        </div>
      </header>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-columns">
          <div className="footer-col">
            <h3>Công ty</h3>
            <ul>
              <li>Giới thiệu</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Sản phẩm</h3>
            <ul>
              <li>Tính năng</li>
              <li>Bảo mật</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Tài nguyên</h3>
            <ul>
              <li>Hướng dẫn</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
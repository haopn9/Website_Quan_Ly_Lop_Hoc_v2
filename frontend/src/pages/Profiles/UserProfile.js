import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { FaEdit, FaLock, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

// Nhận biến 'role' (vai trò) từ ngoài truyền vào: 'admin', 'teacher', hoặc 'student'
const UserProfile = ({ role }) => {
  
  // 1. Dữ liệu giả lập thay đổi linh hoạt theo Role
  const [userData, setUserData] = useState({});
  
  useEffect(() => {
    // Tạm thời mock data dựa theo role. Sau này backend sẽ tự trả về data thật
    if (role === 'admin') {
      setUserData({
        avatar: 'https://i.pravatar.cc/150?img=8', userCode: 'AD001234', fullName: 'Admin Quản Trị', 
        birthDay: '1990-01-01', sex: 'Nam', numberPhone: '0901234567', email: 'admin@school.edu.vn', address: 'Quận 1, TP. HCM'
      });
    } else if (role === 'teacher') {
      setUserData({
        avatar: 'https://i.pravatar.cc/150?img=3', userCode: 'GV001234', fullName: 'Giảng Viên A', 
        birthDay: '1985-05-20', sex: 'Nữ', facultyName: 'Công nghệ thông tin', numberPhone: '0901234567', email: 'gva@school.edu.vn', address: 'Quận 3, TP. HCM'
      });
    } else { // student
      setUserData({
        avatar: 'https://i.pravatar.cc/150?img=11', userCode: 'SV001234', fullName: 'Sinh viên C', 
        birthDay: '2004-05-20', sex: 'Nam', facultyName: 'Công nghệ thông tin', className: 'D19CQCN01-N', numberPhone: '0901234567', email: 'svC@student.edu.vn', address: 'Quận 8, TP. HCM'
      });
    }
  }, [role]);

  const [editForm, setEditForm] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Mật khẩu states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Xử lý Form
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserData(editForm);
    setIsEditModalOpen(false);
    alert('Đã cập nhật hồ sơ thành công!');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setIsPasswordModalOpen(false);
    alert('Đổi mật khẩu thành công!');
  };

  // 2. Xác định các nhãn (label) hiển thị linh động theo Role
  const roleNameDisplay = role === 'admin' ? 'Quản trị viên' : role === 'teacher' ? 'Giảng viên' : 'Sinh viên';
  const codeLabelDisplay = role === 'admin' ? 'Mã số admin:' : role === 'teacher' ? 'Mã số giảng viên:' : 'Mã số sinh viên:';

  return (
    <div className="profile-view-container">
      <div className="profile-header">
        <h2 className="page-title">Hồ sơ cá nhân</h2>
        <p className="page-subtitle">Thông tin chi tiết tài khoản {roleNameDisplay.toLowerCase()} của bạn.</p>
      </div>

      <div className="profile-card-vertical">
        <div className="profile-avatar-wrapper">
          <div className="avatar-circle-large">
            <img src={userData.avatar} alt="User Avatar" />
          </div>
          <h3>{userData.fullName}</h3>
          <span className="role-tag">{roleNameDisplay}</span>
        </div>

        <div className="info-list-vertical">
          <div className="info-item"><span className="info-label">{codeLabelDisplay}</span><span className="info-value">{userData.userCode}</span></div>
          <div className="info-item"><span className="info-label">Họ và tên:</span><span className="info-value">{userData.fullName}</span></div>
          <div className="info-item"><span className="info-label">Ngày sinh:</span><span className="info-value">{userData.birthDay}</span></div>
          <div className="info-item"><span className="info-label">Giới tính:</span><span className="info-value">{userData.sex}</span></div>
          
          {/* CÂU ĐIỀU KIỆN: Chỉ hiện KHOA cho Sinh viên và Giảng viên */}
          {(role === 'student' || role === 'teacher') && (
            <div className="info-item"><span className="info-label">Khoa:</span><span className="info-value">{userData.facultyName}</span></div>
          )}
          
          {/* CÂU ĐIỀU KIỆN: Chỉ hiện LỚP cho Sinh viên */}
          {role === 'student' && (
            <div className="info-item"><span className="info-label">Lớp:</span><span className="info-value">{userData.className}</span></div>
          )}

          <div className="info-item"><span className="info-label">Số điện thoại:</span><span className="info-value">{userData.numberPhone}</span></div>
          <div className="info-item"><span className="info-label">Email:</span><span className="info-value">{userData.email}</span></div>
          <div className="info-item"><span className="info-label">Địa chỉ:</span><span className="info-value">{userData.address}</span></div>
        </div>

        <div className="profile-actions-footer">
          <button className="action-link-btn" onClick={() => { setEditForm(userData); setIsEditModalOpen(true); }}>
            <FaEdit className="icon" /> Cập nhật hồ sơ
          </button>
          <div className="action-divider"></div>
          <button className="action-link-btn" onClick={() => setIsPasswordModalOpen(true)}>
            <FaLock className="icon" /> Đổi mật khẩu
          </button>
        </div>
      </div>
      
      <p className="read-only-note">* Các thông tin định danh cốt lõi chỉ có thể thay đổi bởi Nhà trường & Quản trị viên.</p>

      {/* MODAL 1: FORM CẬP NHẬT HỒ SƠ */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cập nhật hồ sơ</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}><FaTimes /></button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="modal-form">
              <div className="form-grid">
                <div className="form-group"><label>{codeLabelDisplay.replace(':', '')}</label><input type="text" value={editForm.userCode} disabled className="input-readonly" /></div>
                <div className="form-group"><label>Họ và tên</label><input type="text" value={editForm.fullName} disabled className="input-readonly" /></div>
                <div className="form-group"><label>Ngày sinh</label><input type="text" value={editForm.birthDay} disabled className="input-readonly" /></div>
                <div className="form-group"><label>Giới tính</label><input type="text" value={editForm.sex} disabled className="input-readonly" /></div>
                
                {/* Ẩn hiện KHOA / LỚP trong form sửa giống hệt ở ngoài */}
                {(role === 'student' || role === 'teacher') && (
                  <div className="form-group"><label>Khoa</label><input type="text" value={editForm.facultyName} disabled className="input-readonly" /></div>
                )}
                {role === 'student' && (
                  <div className="form-group"><label>Lớp</label><input type="text" value={editForm.className} disabled className="input-readonly" /></div>
                )}
              </div>

              <hr className="modal-divider" />
              <p className="modal-section-title">Thông tin liên hệ (Có thể chỉnh sửa)</p>

              <div className="form-group"><label>Số điện thoại</label><input type="text" name="numberPhone" value={editForm.numberPhone} onChange={handleEditChange} required /></div>
              <div className="form-group"><label>Email</label><input type="email" name="email" value={editForm.email} onChange={handleEditChange} required /></div>
              <div className="form-group"><label>Địa chỉ</label><textarea name="address" value={editForm.address} onChange={handleEditChange} rows="2" required></textarea></div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-save">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FORM ĐỔI MẬT KHẨU (GIỮ NGUYÊN) */}
      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h3>Đổi mật khẩu</h3>
              <button className="close-btn" onClick={() => setIsPasswordModalOpen(false)}><FaTimes /></button>
            </div>
            
            <form onSubmit={handleSavePassword} className="modal-form">
              <div className="form-group">
                <label>Nhập mật khẩu cũ:</label>
                <div className="password-input-wrapper">
                  <input type={showOldPassword ? "text" : "password"} required placeholder="••••••••" />
                  <span className="password-toggle-icon" onClick={() => setShowOldPassword(!showOldPassword)}>{showOldPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Nhập mật khẩu mới:</label>
                <div className="password-input-wrapper">
                  <input type={showNewPassword ? "text" : "password"} required placeholder="••••••••" />
                  <span className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>{showNewPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Nhập lại mật khẩu mới:</label>
                <div className="password-input-wrapper">
                  <input type={showConfirmPassword ? "text" : "password"} required placeholder="••••••••" />
                  <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsPasswordModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-save">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
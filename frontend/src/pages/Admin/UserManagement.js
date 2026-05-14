// UserManagement.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaLock, FaUnlock } from 'react-icons/fa';
import './styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    maSo: '',
    tenDangNhap: '',
    hoTen: '',
    email: '',
    matKhau: '',
    maKhoa: '1',
    maVaiTro: '3'
  });

  // Danh sách khoa từ bảng Khoa
  const khoaList = [
    { MaKhoa: 1, TenKhoa: 'Công nghệ thông tin' },
    { MaKhoa: 2, TenKhoa: 'Kỹ thuật máy tính' },
    { MaKhoa: 3, TenKhoa: 'Hệ thống thông tin' },
  ];

  // Danh sách vai trò từ bảng VaiTro
  const vaiTroList = [
    { MaVaiTro: 1, TenVaiTro: 'Quản trị' },
    { MaVaiTro: 2, TenVaiTro: 'Giảng viên' },
    { MaVaiTro: 3, TenVaiTro: 'Sinh viên' },
  ];

  // Giả lập lấy dữ liệu từ database
  useEffect(() => {
    // TODO: Gọi API từ backend
    // fetch('/api/admin/users')
    //   .then(res => res.json())
    //   .then(data => setUsers(data))
    
    // Dữ liệu mẫu từ bảng NguoiDung
    setUsers([
      { id: 1, maSo: 'ADMIN001', tenDangNhap: 'admin', hoTen: 'Quản trị viên hệ thống', email: 'admin@stu.edu.vn', maVaiTro: 1, tenVaiTro: 'Quản trị', dangHoatDong: true },
      { id: 2, maSo: 'GV001', tenDangNhap: 'gv.nguyenvana', hoTen: 'Nguyễn Văn A', email: 'gv001@stu.edu.vn', maVaiTro: 2, tenVaiTro: 'Giảng viên', dangHoatDong: true },
      { id: 3, maSo: 'GV002', tenDangNhap: 'gv.tranthib', hoTen: 'Trần Thị B', email: 'gv002@stu.edu.vn', maVaiTro: 2, tenVaiTro: 'Giảng viên', dangHoatDong: true },
      { id: 4, maSo: 'DH52200320', tenDangNhap: 'dh52200320', hoTen: 'Đặng Võ Phương Anh', email: 'DH52200320@student.stu.edu.vn', maVaiTro: 3, tenVaiTro: 'Sinh viên', dangHoatDong: true },
      { id: 5, maSo: 'DH52300086', tenDangNhap: 'dh52300086', hoTen: 'Trần Quốc Anh', email: 'DH52300086@student.stu.edu.vn', maVaiTro: 3, tenVaiTro: 'Sinh viên', dangHoatDong: true },
    ]);
    setLoading(false);
  }, []);

  // Lọc người dùng
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.tenDangNhap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.maSo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.maVaiTro === parseInt(selectedRole);
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (userId) => {
    // TODO: Gọi API cập nhật trạng thái
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, dangHoatDong: !user.dangHoatDong }
        : user
    ));
  };

  const deleteUser = (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      // TODO: Gọi API xóa (soft delete)
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleAddUser = () => {
    if (!newUser.maSo || !newUser.tenDangNhap || !newUser.hoTen || !newUser.email || !newUser.matKhau) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    
    // TODO: Gọi API thêm người dùng
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const vaiTro = vaiTroList.find(v => v.MaVaiTro === parseInt(newUser.maVaiTro));
    setUsers([...users, {
      id: newId,
      maSo: newUser.maSo,
      tenDangNhap: newUser.tenDangNhap,
      hoTen: newUser.hoTen,
      email: newUser.email,
      maVaiTro: parseInt(newUser.maVaiTro),
      tenVaiTro: vaiTro?.TenVaiTro,
      dangHoatDong: true
    }]);
    
    setNewUser({ maSo: '', tenDangNhap: '', hoTen: '', email: '', matKhau: '', maKhoa: '1', maVaiTro: '3' });
    setShowAddModal(false);
    alert('Thêm người dùng thành công!');
  };

  if (loading) {
    return <div className="loading-state">Đang tải dữ liệu từ bảng NguoiDung...</div>;
  }

  return (
    <div className="management-tab">
      <div className="page-header-modern">
        <div className="header-content">
          <h2>Quản lý người dùng</h2>
          <p>Quản lý tài khoản từ người dùng</p>
        </div>
      </div>

      <div className="toolbar-modern">
        <button className="btn-add-modern" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Thêm người dùng
        </button>
        
        <div className="search-filter-group">
          <div className="search-box-modern">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, mã số, tài khoản..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FaTimes />
              </button>
            )}
          </div>
          
          <select 
            className="filter-select-modern" 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            {vaiTroList.map(role => (
              <option key={role.MaVaiTro} value={role.MaVaiTro}>{role.TenVaiTro}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-modern">
        <div className="table-wrapper">
          <table className="data-table-modern">
            <thead>
              <tr>
                <th>Mã số</th>
                <th>Tên đăng nhập</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td><span className="id-badge">{user.maSo}</span></td>
                  <td>{user.tenDangNhap}</td>
                  <td>{user.hoTen}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge-modern ${user.maVaiTro === 1 ? 'admin' : user.maVaiTro === 2 ? 'teacher' : 'student'}`}>
                      {user.tenVaiTro}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.dangHoatDong ? 'active' : 'inactive'}`}>
                      {user.dangHoatDong ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="action-cells">
                    <button className="action-btn edit" title="Sửa">
                      <FaEdit />
                    </button>
                    <button 
                      className="action-btn edit" 
                      title={user.dangHoatDong ? 'Khóa' : 'Mở khóa'}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.dangHoatDong ? <FaLock /> : <FaUnlock />}
                    </button>
                    <button className="action-btn delete" title="Xóa" onClick={() => deleteUser(user.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="table-footer">
          <span>Hiển thị {filteredUsers.length} / {users.length} người dùng (từ bảng NguoiDung)</span>
        </div>
      </div>

      {/* Modal thêm người dùng */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm người dùng mới vào bảng NguoiDung</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Mã số (MSSV/MSGV) <span className="required">*</span></label>
                <input 
                  type="text" 
                  placeholder="VD: DH52200320 hoặc GV001"
                  value={newUser.maSo}
                  onChange={(e) => setNewUser({...newUser, maSo: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Tên đăng nhập <span className="required">*</span></label>
                <input 
                  type="text" 
                  placeholder="Username"
                  value={newUser.tenDangNhap}
                  onChange={(e) => setNewUser({...newUser, tenDangNhap: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Họ và tên <span className="required">*</span></label>
                <input 
                  type="text" 
                  placeholder="Nhập họ và tên"
                  value={newUser.hoTen}
                  onChange={(e) => setNewUser({...newUser, hoTen: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input 
                  type="email" 
                  placeholder="example@stu.edu.vn"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu <span className="required">*</span></label>
                <input 
                  type="password" 
                  placeholder="Nhập mật khẩu"
                  value={newUser.matKhau}
                  onChange={(e) => setNewUser({...newUser, matKhau: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Khoa (tham chiếu bảng Khoa)</label>
                <select 
                  value={newUser.maKhoa}
                  onChange={(e) => setNewUser({...newUser, maKhoa: e.target.value})}
                >
                  {khoaList.map(khoa => (
                    <option key={khoa.MaKhoa} value={khoa.MaKhoa}>{khoa.TenKhoa}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Vai trò (tham chiếu bảng VaiTro) <span className="required">*</span></label>
                <select 
                  value={newUser.maVaiTro}
                  onChange={(e) => setNewUser({...newUser, maVaiTro: e.target.value})}
                >
                  {vaiTroList.map(role => (
                    <option key={role.MaVaiTro} value={role.MaVaiTro}>{role.TenVaiTro}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
              <button className="btn-save" onClick={handleAddUser}>Thêm vào NguoiDung</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
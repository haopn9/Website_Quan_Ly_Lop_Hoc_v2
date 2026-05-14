// ClassManagement.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaUsers, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';
import './styles/ClassManagement.css';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newClass, setNewClass] = useState({
    maLopHoc: '',
    tenLop: '',
    maGiangVien: '',
    maHocKy: '1'
  });

  // Danh sách giảng viên từ bảng NguoiDung (MaVaiTro = 2)
  const [giangVienList, setGiangVienList] = useState([]);
  
  // Danh sách học kỳ từ bảng HocKy
  const [hocKyList, setHocKyList] = useState([]);

  useEffect(() => {
    // TODO: Gọi API từ backend
    // Dữ liệu mẫu từ bảng LopHoc
    setClasses([
      { id: 1, maLopHoc: 'LT_WEB_01', tenLop: 'Lập trình Web', maGiangVien: 2, tenGiangVien: 'Nguyễn Văn A', maHocKy: 1, tenHocKy: 'Học kỳ 2 2025-2026', soSinhVien: 45, soNhom: 9, trangThai: 'active' },
      { id: 2, maLopHoc: 'CSDL_01', tenLop: 'Cơ sở dữ liệu', maGiangVien: 3, tenGiangVien: 'Trần Thị B', maHocKy: 1, tenHocKy: 'Học kỳ 2 2025-2026', soSinhVien: 38, soNhom: 8, trangThai: 'active' },
      { id: 3, maLopHoc: 'JAVA_01', tenLop: 'Lập trình Java', maGiangVien: 4, tenGiangVien: 'Lê Hồng C', maHocKy: 1, tenHocKy: 'Học kỳ 2 2025-2026', soSinhVien: 42, soNhom: 9, trangThai: 'active' },
    ]);

    setGiangVienList([
      { MaNguoiDung: 2, HoTen: 'Nguyễn Văn A' },
      { MaNguoiDung: 3, HoTen: 'Trần Thị B' },
      { MaNguoiDung: 4, HoTen: 'Lê Hồng C' },
    ]);

    setHocKyList([
      { MaHocKy: 1, TenHocKy: 'Học kỳ 2 2025-2026' },
    ]);
    
    setLoading(false);
  }, []);

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.tenLop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          classItem.maLopHoc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || classItem.maHocKy === parseInt(selectedSemester);
    const matchesStatus = selectedStatus === 'all' || classItem.trangThai === selectedStatus;
    return matchesSearch && matchesSemester && matchesStatus;
  });

  const deleteClass = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa lớp học này?')) {
      // TODO: Gọi API xóa
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  const handleAddClass = () => {
    if (!newClass.maLopHoc || !newClass.tenLop || !newClass.maGiangVien) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    
    // TODO: Gọi API thêm lớp học vào bảng LopHoc
    const giangVien = giangVienList.find(g => g.MaNguoiDung === parseInt(newClass.maGiangVien));
    const hocKy = hocKyList.find(h => h.MaHocKy === parseInt(newClass.maHocKy));
    
    const newId = Math.max(...classes.map(c => c.id), 0) + 1;
    setClasses([...classes, {
      id: newId,
      maLopHoc: newClass.maLopHoc,
      tenLop: newClass.tenLop,
      maGiangVien: parseInt(newClass.maGiangVien),
      tenGiangVien: giangVien?.HoTen,
      maHocKy: parseInt(newClass.maHocKy),
      tenHocKy: hocKy?.TenHocKy,
      soSinhVien: 0,
      soNhom: 0,
      trangThai: 'active'
    }]);
    
    setNewClass({ maLopHoc: '', tenLop: '', maGiangVien: '', maHocKy: '1' });
    setShowAddModal(false);
    alert('Thêm lớp học thành công vào bảng LopHoc!');
  };

  if (loading) {
    return <div className="loading-state">Đang tải dữ liệu từ bảng LopHoc...</div>;
  }

  return (
    <div className="management-tab">
      <div className="page-header-modern">
        <div className="header-content">
          <h2>Quản lý lớp học</h2>
          <p>Quản lý danh sách lớp học </p>
        </div>
      </div>

      <div className="toolbar-modern">
        <button className="btn-add-modern" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Tạo lớp học mới
        </button>
        
        <div className="search-filter-group">
          <div className="search-box-modern">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên lớp, mã lớp..." 
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
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="all">Tất cả học kỳ</option>
            {hocKyList.map(hk => (
              <option key={hk.MaHocKy} value={hk.MaHocKy}>{hk.TenHocKy}</option>
            ))}
          </select>
          
          <select 
            className="filter-select-modern" 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm dừng</option>
          </select>
        </div>
      </div>

      <div className="classes-grid-modern">
        {filteredClasses.map(classItem => (
          <div key={classItem.id} className="class-card-modern">
            <div className="class-card-header">
              <div className="class-title">
                <h3>{classItem.tenLop}</h3>
                <span className="class-code">{classItem.maLopHoc}</span>
              </div>
              <span className={`status-badge-modern ${classItem.trangThai}`}>
                {classItem.trangThai === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
              </span>
            </div>
            
            <div className="class-card-body">
              <div className="class-info-row">
                <FaChalkboardTeacher className="info-icon" />
                <span>{classItem.tenGiangVien}</span>
              </div>
              <div className="class-info-row">
                <FaCalendarAlt className="info-icon" />
                <span>{classItem.tenHocKy}</span>
              </div>
              <div className="class-stats-modern">
                <div className="stat-item">
                  <FaUsers className="stat-icon" />
                  <span>{classItem.soSinhVien} Sinh viên (từ bảng SinhVienLop)</span>
                </div>
                <div className="stat-item">
                  <FaUsers className="stat-icon" />
                  <span>{classItem.soNhom} Nhóm (từ bảng Nhom)</span>
                </div>
              </div>
            </div>
            
            <div className="class-card-footer">
              <button className="action-btn edit" title="Chỉnh sửa">
                <FaEdit />
              </button>
              <button className="action-btn delete" title="Xóa" onClick={() => deleteClass(classItem.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredClasses.length === 0 && (
        <div className="empty-state">
          <p>Không tìm thấy lớp học nào trong bảng LopHoc</p>
        </div>
      )}

      {/* Modal thêm lớp học */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm lớp học vào bảng LopHoc</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Mã lớp học <span className="required">*</span></label>
                <input 
                  type="text" 
                  placeholder="VD: LT_WEB_01"
                  value={newClass.maLopHoc}
                  onChange={(e) => setNewClass({...newClass, maLopHoc: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Tên lớp học <span className="required">*</span></label>
                <input 
                  type="text" 
                  placeholder="Nhập tên môn học"
                  value={newClass.tenLop}
                  onChange={(e) => setNewClass({...newClass, tenLop: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Giảng viên (FK từ bảng NguoiDung) <span className="required">*</span></label>
                <select 
                  value={newClass.maGiangVien}
                  onChange={(e) => setNewClass({...newClass, maGiangVien: e.target.value})}
                >
                  <option value="">Chọn giảng viên</option>
                  {giangVienList.map(gv => (
                    <option key={gv.MaNguoiDung} value={gv.MaNguoiDung}>{gv.HoTen}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Học kỳ (FK từ bảng HocKy)</label>
                <select 
                  value={newClass.maHocKy}
                  onChange={(e) => setNewClass({...newClass, maHocKy: e.target.value})}
                >
                  {hocKyList.map(hk => (
                    <option key={hk.MaHocKy} value={hk.MaHocKy}>{hk.TenHocKy}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
              <button className="btn-save" onClick={handleAddClass}>Tạo lớp học</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
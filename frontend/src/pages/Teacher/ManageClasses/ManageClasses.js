import React, { useState, useEffect } from 'react';
import './ManageClasses.css';
import { FaPlus, FaSearch, FaChalkboardTeacher, FaUsers, FaBookOpen, FaCalendarAlt, FaEye, FaEdit, FaTrash, FaTimes, FaCopy } from 'react-icons/fa';
import classService from '../../../services/classService';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    tenLop: '', 
    maHocKy: '', 
    ngayBatDau: '', 
    ngayKetThuc: '',
    thoiGianHoc: ''
  });

  // Lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      try {
        const semestersData = await classService.getSemesters();
        setSemesters(semestersData || []);
        if (semestersData && semestersData.length > 0 && filterSemester === 'all') {
          const currentSem = semestersData.find(s => s.laHienTai) || semestersData[0];
          setFormData(prev => ({ ...prev, maHocKy: currentSem.maHocKy }));
        }
      } catch (semErr) {
        console.error('Lỗi khi lấy học kỳ:', semErr);
      }

      try {
        const classesData = await classService.getTeacherClasses();
        setClasses(classesData || []);
      } catch (clsErr) {
        console.error('Lỗi khi lấy lớp học:', clsErr);
      }

    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== XỬ LÝ =====
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenCreate = () => {
    const currentSem = semesters.find(s => s.laHienTai) || semesters[0];
    setFormData({ tenLop: '', maHocKy: currentSem ? currentSem.maHocKy : '', ngayBatDau: '', ngayKetThuc: '', thoiGianHoc: '' });
    setIsCreateModalOpen(true);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await classService.createClass({
        tenLop: formData.tenLop,
        maHocKy: parseInt(formData.maHocKy),
        ngayBatDau: formData.ngayBatDau || null,
        ngayKetThuc: formData.ngayKetThuc || null,
        thoiGianHoc: formData.thoiGianHoc || null
      });
      alert('Tạo lớp học thành công!');
      setIsCreateModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.thongBao || 'Lỗi khi tạo lớp học');
    }
  };

  const handleOpenEdit = (cls) => {
    setSelectedClass(cls);
    setFormData({
      tenLop: cls.tenLop, 
      maHocKy: cls.maHocKy, 
      ngayBatDau: cls.ngayBatDau ? cls.ngayBatDau.split('T')[0] : '', 
      ngayKetThuc: cls.ngayKetThuc ? cls.ngayKetThuc.split('T')[0] : '',
      thoiGianHoc: cls.thoiGianHoc || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    try {
      await classService.updateClass(selectedClass.maLop, {
        tenLop: formData.tenLop,
        maHocKy: parseInt(formData.maHocKy),
        ngayBatDau: formData.ngayBatDau || null,
        ngayKetThuc: formData.ngayKetThuc || null,
        thoiGianHoc: formData.thoiGianHoc || null
      });
      alert('Cập nhật lớp học thành công!');
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.thongBao || 'Lỗi khi cập nhật lớp học');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm('Bạn có chắc muốn xóa lớp học này? Dữ liệu không thể khôi phục.')) {
      try {
        await classService.deleteClass(classId);
        alert('Xóa lớp học thành công!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.thongBao || 'Lỗi khi xóa lớp học. Lớp học có thể đã có sinh viên hoặc nhóm.');
      }
    }
  };

  const handleViewDetail = (cls) => {
    setSelectedClass(cls);
    setIsDetailModalOpen(true);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã lớp: ${code}`);
  };

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này khỏi lớp?')) {
      try {
        await classService.removeStudentFromClass(selectedClass.maLop, studentId);
        alert('Đã xóa sinh viên khỏi lớp!');
        
        // Cập nhật UI ngay lập tức
        const updatedStudents = selectedClass.danhSachSinhVien.filter(sv => sv.maNguoiDung !== studentId);
        const updatedClass = { ...selectedClass, danhSachSinhVien: updatedStudents, soSinhVien: updatedStudents.length };
        setSelectedClass(updatedClass);
        setClasses(classes.map(c => c.maLop === updatedClass.maLop ? updatedClass : c));
      } catch (error) {
        alert(error.response?.data?.thongBao || 'Lỗi khi xóa sinh viên khỏi lớp');
      }
    }
  };

  // Filter
  const filteredClasses = classes.filter(c => {
    const matchSearch = (c.tenLop || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (c.maLopHoc || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchSemester = filterSemester === 'all' || (c.maHocKy || '').toString() === filterSemester;
    return matchSearch && matchSemester;
  });

  // Stats
  const totalClasses = classes.length;
  const activeClasses = classes.filter(c => c.trangThai === 'active').length;
  const totalStudents = classes.reduce((sum, c) => sum + c.soSinhVien, 0);
  const totalGroups = classes.reduce((sum, c) => sum + c.soNhom, 0);

  if (isLoading) {
    return <div className="loading-state">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="manage-classes-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Lớp học</h2>
          <p className="page-subtitle">Tạo và quản lý các lớp học phần do bạn phụ trách</p>
        </div>
        <button className="btn-primary" onClick={handleOpenCreate}>
          <FaPlus /> Tạo lớp mới
        </button>
      </div>

      {/* THỐNG KÊ */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue"><FaChalkboardTeacher /></div>
          <div className="stat-info">
            <h4>Tổng lớp học</h4>
            <span className="stat-number">{totalClasses}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FaBookOpen /></div>
          <div className="stat-info">
            <h4>Đang hoạt động</h4>
            <span className="stat-number">{activeClasses}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><FaUsers /></div>
          <div className="stat-info">
            <h4>Tổng sinh viên</h4>
            <span className="stat-number">{totalStudents}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><FaCalendarAlt /></div>
          <div className="stat-info">
            <h4>Tổng nhóm</h4>
            <span className="stat-number">{totalGroups}</span>
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM + LỌC */}
      <div className="toolbar-row">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text" placeholder="Tìm kiếm lớp học hoặc mã lớp..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select" value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)}>
          <option value="all">Tất cả học kỳ</option>
          {semesters.map(s => <option key={s.maHocKy} value={s.maHocKy}>{s.tenHocKy}</option>)}
        </select>
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="data-table-wrapper">
        {filteredClasses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>Không tìm thấy lớp học nào</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã tham gia</th>
                <th>Tên môn học</th>
                <th>Học kỳ</th>
                <th>Sinh viên</th>
                <th>Nhóm</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map(cls => (
                <tr key={cls.maLop}>
                  <td><span className="class-code-tag" title="Nhấn để sao chép" onClick={() => handleCopyCode(cls.maLopHoc)} style={{cursor: 'pointer'}}>{cls.maLopHoc}</span></td>
                  <td><strong>{cls.tenLop}</strong></td>
                  <td>{cls.tenHocKy}</td>
                  <td>{cls.soSinhVien}</td>
                  <td>{cls.soNhom}</td>
                  <td>
                    <span className={`badge ${cls.trangThai === 'active' ? 'badge-active' : 'badge-ended'}`}>
                      {cls.trangThai === 'active' ? 'Đang hoạt động' : 'Đã kết thúc'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn view" title="Xem chi tiết" onClick={() => handleViewDetail(cls)}><FaEye /></button>
                      <button className="action-btn edit" title="Chỉnh sửa" onClick={() => handleOpenEdit(cls)}><FaEdit /></button>
                      <button className="action-btn delete" title="Xóa" onClick={() => handleDeleteClass(cls.maLop)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL TẠO LỚP MỚI */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tạo lớp học mới</h3>
              <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateClass}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Tên môn học *</label>
                    <input type="text" name="tenLop" value={formData.tenLop} onChange={handleFormChange} placeholder="VD: Lập trình Web" required />
                  </div>
                  <div className="form-group">
                    <label>Học kỳ *</label>
                    <select name="maHocKy" value={formData.maHocKy} onChange={handleFormChange} required>
                      {semesters.map(s => (
                        <option key={s.maHocKy} value={s.maHocKy}>{s.tenHocKy}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Thời gian học</label>
                    <input type="text" name="thoiGianHoc" value={formData.thoiGianHoc} onChange={handleFormChange} placeholder="VD: Thứ 2, Tiết 1-3" />
                  </div>
                  <div className="form-group">
                    <label>Ngày bắt đầu</label>
                    <input type="date" name="ngayBatDau" value={formData.ngayBatDau} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Ngày kết thúc</label>
                    <input type="date" name="ngayKetThuc" value={formData.ngayKetThuc} onChange={handleFormChange} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsCreateModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-save">Tạo lớp học</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA LỚP */}
      {isEditModalOpen && selectedClass && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chỉnh sửa lớp học</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleEditClass}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Tên môn học *</label>
                    <input type="text" name="tenLop" value={formData.tenLop} onChange={handleFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>Học kỳ *</label>
                    <select name="maHocKy" value={formData.maHocKy} onChange={handleFormChange} required>
                      {semesters.map(s => (
                        <option key={s.maHocKy} value={s.maHocKy}>{s.tenHocKy}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Thời gian học</label>
                    <input type="text" name="thoiGianHoc" value={formData.thoiGianHoc} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Ngày bắt đầu</label>
                    <input type="date" name="ngayBatDau" value={formData.ngayBatDau} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Ngày kết thúc</label>
                    <input type="date" name="ngayKetThuc" value={formData.ngayKetThuc} onChange={handleFormChange} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-save">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT LỚP + DANH SÁCH SINH VIÊN */}
      {isDetailModalOpen && selectedClass && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết lớp học</h3>
              <button className="close-btn" onClick={() => setIsDetailModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="class-detail-header">
                <div className="class-code-display" title="Nhấn để sao chép" onClick={() => handleCopyCode(selectedClass.maLopHoc)} style={{ cursor: 'pointer' }}>
                  <FaCopy style={{ marginRight: 8, fontSize: 14 }} />{selectedClass.maLopHoc}
                </div>
                <div className="class-info">
                  <h4>{selectedClass.tenLop}</h4>
                  <p>{selectedClass.tenHocKy} &nbsp;|&nbsp; {selectedClass.ngayBatDau || '--'} → {selectedClass.ngayKetThuc || '--'}</p>
                </div>
              </div>

              <h4 style={{ marginBottom: 12, color: '#152259' }}>Danh sách sinh viên ({selectedClass.danhSachSinhVien?.length || 0})</h4>

              {(!selectedClass.danhSachSinhVien || selectedClass.danhSachSinhVien.length === 0) ? (
                <div className="empty-state">
                  <p>Chưa có sinh viên trong lớp này</p>
                </div>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>MSSV</th>
                        <th>Họ và tên</th>
                        <th>Lớp SV</th>
                        <th>Nhóm</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClass.danhSachSinhVien.map((sv, idx) => (
                        <tr key={sv.maNguoiDung}>
                          <td>{idx + 1}</td>
                          <td><strong>{sv.maSo}</strong></td>
                          <td>{sv.hoTen} {sv.laNhomTruong && <span style={{color: 'orange', fontSize: 12}}>(Nhóm trưởng)</span>}</td>
                          <td>{sv.lopSinhVien}</td>
                          <td>
                            {sv.tenNhom ? (
                              <span style={{color: 'green'}}>{sv.tenNhom}</span>
                            ) : (
                              <span style={{color: 'gray'}}>Chưa có nhóm</span>
                            )}
                          </td>
                          <td>
                            <button className="btn-sm danger" onClick={() => handleRemoveStudent(sv.maNguoiDung)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsDetailModalOpen(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClasses;

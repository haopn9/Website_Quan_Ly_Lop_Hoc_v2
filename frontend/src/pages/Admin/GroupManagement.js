// GroupManagement.js - Giao diện đẹp, hiện đại
import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaUsers, FaTasks, 
  FaComments, FaUserPlus, FaCheckCircle, FaClock, FaUserCog, 
  FaEye, FaBook, FaCalendarAlt, FaSave
} from 'react-icons/fa';
import './styles/GroupManagement.css';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupDetail, setShowGroupDetail] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newGroup, setNewGroup] = useState({
    tenNhom: '',
    maLop: '',
    maNhomTruong: '',
    soThanhVienToiDa: 5
  });

  const [newTopic, setNewTopic] = useState({
    tenDeTai: '',
    moTa: '',
    sanPhamKyVong: '',
    ngayBatDau: '',
    ngayKetThuc: ''
  });

  const [classList, setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    setGroups([
      { id: 1, tenNhom: 'Nhóm 1', maLop: 1, tenLop: 'Lập trình Web', soThanhVien: 5, maNhomTruong: 'DH52200320', tenNhomTruong: 'Đặng Võ Phương Anh', soLuongTask: 4, soLuongHoanThanh: 3, soLuongTinNhan: 45, trangThai: 'active', maDeTai: 1, tenDeTai: 'Website bán hàng trực tuyến', moTaDeTai: 'Xây dựng website bán hàng với đầy đủ chức năng', sanPhamKyVong: 'Website hoàn chỉnh, báo cáo', ngayBatDauDeTai: '2026-01-10', ngayKetThucDeTai: '2026-03-20' },
      { id: 2, tenNhom: 'Nhóm 2', maLop: 1, tenLop: 'Lập trình Web', soThanhVien: 5, maNhomTruong: 'DH52300086', tenNhomTruong: 'Trần Quốc Anh', soLuongTask: 3, soLuongHoanThanh: 1, soLuongTinNhan: 28, trangThai: 'active', maDeTai: null, tenDeTai: null, moTaDeTai: null, sanPhamKyVong: null, ngayBatDauDeTai: null, ngayKetThucDeTai: null },
      { id: 3, tenNhom: 'Nhóm 1', maLop: 2, tenLop: 'Cơ sở dữ liệu', soThanhVien: 4, maNhomTruong: 'DH52300101', tenNhomTruong: 'Dương Hoàng Ân', soLuongTask: 2, soLuongHoanThanh: 0, soLuongTinNhan: 12, trangThai: 'active', maDeTai: null, tenDeTai: null, moTaDeTai: null, sanPhamKyVong: null, ngayBatDauDeTai: null, ngayKetThucDeTai: null },
    ]);

    setClassList([
      { MaLop: 1, TenLop: 'Lập trình Web' },
      { MaLop: 2, TenLop: 'Cơ sở dữ liệu' },
      { MaLop: 3, TenLop: 'Lập trình Java' },
    ]);

    setStudentList([
      { MaNguoiDung: 'DH52200320', HoTen: 'Đặng Võ Phương Anh' },
      { MaNguoiDung: 'DH52300086', HoTen: 'Trần Quốc Anh' },
      { MaNguoiDung: 'DH52300101', HoTen: 'Dương Hoàng Ân' },
    ]);
    
    setLoading(false);
  }, []);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.tenNhom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.tenNhomTruong.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (group.tenDeTai && group.tenDeTai.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = selectedClass === 'all' || group.maLop === parseInt(selectedClass);
    const matchesStatus = selectedStatus === 'all' || group.trangThai === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const deleteGroup = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhóm này?')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  const viewGroupDetail = (group) => {
    setSelectedGroup(group);
    setShowGroupDetail(true);
  };

  const handleAddGroup = () => {
    if (!newGroup.tenNhom || !newGroup.maLop || !newGroup.maNhomTruong) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    
    const lop = classList.find(l => l.MaLop === parseInt(newGroup.maLop));
    const sv = studentList.find(s => s.MaNguoiDung === newGroup.maNhomTruong);
    
    const newId = Math.max(...groups.map(g => g.id), 0) + 1;
    setGroups([...groups, {
      id: newId,
      tenNhom: newGroup.tenNhom,
      maLop: parseInt(newGroup.maLop),
      tenLop: lop?.TenLop,
      soThanhVien: 1,
      maNhomTruong: newGroup.maNhomTruong,
      tenNhomTruong: sv?.HoTen,
      soLuongTask: 0,
      soLuongHoanThanh: 0,
      soLuongTinNhan: 0,
      trangThai: 'active',
      maDeTai: null,
      tenDeTai: null,
      moTaDeTai: null,
      sanPhamKyVong: null,
      ngayBatDauDeTai: null,
      ngayKetThucDeTai: null
    }]);
    
    setNewGroup({ tenNhom: '', maLop: '', maNhomTruong: '', soThanhVienToiDa: 5 });
    setShowAddModal(false);
    alert('Thêm nhóm thành công!');
  };

  const handleAddTopic = () => {
    if (!newTopic.tenDeTai) {
      alert('Vui lòng nhập tên đề tài!');
      return;
    }
    
    const newMaDeTai = Math.max(...groups.filter(g => g.maDeTai).map(g => g.maDeTai), 0) + 1;
    
    setGroups(groups.map(g => 
      g.id === selectedGroup.id 
        ? { 
            ...g, 
            maDeTai: newMaDeTai,
            tenDeTai: newTopic.tenDeTai,
            moTaDeTai: newTopic.moTa,
            sanPhamKyVong: newTopic.sanPhamKyVong,
            ngayBatDauDeTai: newTopic.ngayBatDau,
            ngayKetThucDeTai: newTopic.ngayKetThuc
          }
        : g
    ));
    
    setNewTopic({
      tenDeTai: '',
      moTa: '',
      sanPhamKyVong: '',
      ngayBatDau: '',
      ngayKetThuc: ''
    });
    
    setShowTopicModal(false);
    alert('Đã thêm đề tài cho nhóm!');
  };

  const openTopicModal = (group) => {
    setSelectedGroup(group);
    setNewTopic({
      tenDeTai: '',
      moTa: '',
      sanPhamKyVong: '',
      ngayBatDau: '',
      ngayKetThuc: ''
    });
    setShowTopicModal(true);
  };

  if (loading) {
    return <div className="loading-state">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="group-management">
      {/* Header Gradient */}
      <div className="group-header-gradient">
        <div className="header-content">
          <h2>Quản lý nhóm học tập</h2>
          <p>Quản lý danh sách nhóm, đề tài và theo dõi tiến độ làm việc nhóm</p>
        </div>
      </div>

      {/* Thanh công cụ */}
      <div className="group-toolbar">
        <button className="btn-create-group" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Tạo nhóm mới
        </button>
        
        <div className="group-filters">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhóm, nhóm trưởng, đề tài..." 
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
            className="filter-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">📚 Tất cả lớp học</option>
            {classList.map(lop => (
              <option key={lop.MaLop} value={lop.MaLop}>{lop.TenLop}</option>
            ))}
          </select>
          
          <select 
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">🔄 Tất cả trạng thái</option>
            <option value="active">✅ Đang hoạt động</option>
            <option value="inactive">⏸️ Đã kết thúc</option>
          </select>
        </div>
      </div>

      {/* Danh sách nhóm dạng card */}
      <div className="groups-container">
        {filteredGroups.map(group => (
          <div key={group.id} className="group-card">
            <div className="group-card-header">
              <div className="group-name">
                <h3>{group.tenNhom}</h3>
                <span className="class-badge">{group.tenLop}</span>
              </div>
              <span className={`status-badge ${group.trangThai}`}>
                {group.trangThai === 'active' ? 'Đang hoạt động' : 'Đã kết thúc'}
              </span>
            </div>
            
            <div className="group-card-body">
              <div className="group-leader">
                <FaUserCog className="icon-leader" />
                <span><strong>Nhóm trưởng:</strong> {group.tenNhomTruong}</span>
              </div>
              
              {/* Thông tin đề tài */}
              {group.tenDeTai ? (
                <div className="group-topic">
                  <div className="topic-header">
                    <FaBook className="topic-icon" />
                    <span className="topic-title">{group.tenDeTai}</span>
                  </div>
                  <div className="topic-date">
                    <FaCalendarAlt /> {group.ngayBatDauDeTai} → {group.ngayKetThucDeTai}
                  </div>
                </div>
              ) : (
                <div className="group-topic empty">
                  <FaBook className="topic-icon" />
                  <span>Chưa có đề tài</span>
                  <button className="btn-add-topic" onClick={() => openTopicModal(group)}>
                    <FaPlus /> Thêm đề tài
                  </button>
                </div>
              )}
              
              <div className="group-stats">
                <div className="stat">
                  <FaUsers />
                  <span>{group.soThanhVien} thành viên</span>
                </div>
                <div className="stat">
                  <FaTasks />
                  <span>{group.soLuongHoanThanh}/{group.soLuongTask} việc</span>
                </div>
                <div className="stat">
                  <FaComments />
                  <span>{group.soLuongTinNhan} tin nhắn</span>
                </div>
              </div>
              
              <div className="progress-wrapper">
                <div className="progress-label">
                  <span>Tiến độ nhóm</span>
                  <span className="progress-value">
                    {Math.round((group.soLuongHoanThanh / group.soLuongTask) * 100)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${group.soLuongTask ? (group.soLuongHoanThanh / group.soLuongTask) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="group-card-footer">
              <button className="btn-action view" onClick={() => viewGroupDetail(group)}>
                <FaEye /> Chi tiết
              </button>
              <button className="btn-action edit">
                <FaUserPlus /> Thêm TV
              </button>
              <button className="btn-action edit">
                <FaEdit />
              </button>
              <button className="btn-action delete" onClick={() => deleteGroup(group.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredGroups.length === 0 && (
        <div className="empty-state">
          <FaUsers className="empty-icon" />
          <h3>Không tìm thấy nhóm nào</h3>
          <p>Hãy thử thay đổi bộ lọc hoặc tạo nhóm mới</p>
        </div>
      )}

      {/* Modal thêm nhóm */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✨ Tạo nhóm mới</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tên nhóm</label>
                <input 
                  type="text" 
                  placeholder="VD: Nhóm 1, Team Alpha..."
                  value={newGroup.tenNhom}
                  onChange={(e) => setNewGroup({...newGroup, tenNhom: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Lớp học</label>
                <select 
                  value={newGroup.maLop}
                  onChange={(e) => setNewGroup({...newGroup, maLop: e.target.value})}
                >
                  <option value="">Chọn lớp học</option>
                  {classList.map(lop => (
                    <option key={lop.MaLop} value={lop.MaLop}>{lop.TenLop}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Nhóm trưởng</label>
                <select 
                  value={newGroup.maNhomTruong}
                  onChange={(e) => setNewGroup({...newGroup, maNhomTruong: e.target.value})}
                >
                  <option value="">Chọn nhóm trưởng</option>
                  {studentList.map(sv => (
                    <option key={sv.MaNguoiDung} value={sv.MaNguoiDung}>{sv.HoTen}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Số thành viên tối đa</label>
                <input 
                  type="number" 
                  placeholder="5"
                  value={newGroup.soThanhVienToiDa}
                  onChange={(e) => setNewGroup({...newGroup, soThanhVienToiDa: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Hủy bỏ</button>
              <button className="btn-save" onClick={handleAddGroup}>
                <FaSave /> Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm đề tài */}
      {showTopicModal && selectedGroup && (
        <div className="modal-overlay" onClick={() => setShowTopicModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📖 Thêm đề tài cho {selectedGroup.tenNhom}</h3>
              <button className="modal-close" onClick={() => setShowTopicModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tên đề tài</label>
                <input 
                  type="text" 
                  placeholder="Nhập tên đề tài..."
                  value={newTopic.tenDeTai}
                  onChange={(e) => setNewTopic({...newTopic, tenDeTai: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  rows="3"
                  placeholder="Mô tả chi tiết về đề tài..."
                  value={newTopic.moTa}
                  onChange={(e) => setNewTopic({...newTopic, moTa: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Sản phẩm kỳ vọng</label>
                <textarea 
                  rows="2"
                  placeholder="Sản phẩm cần bàn giao khi hoàn thành..."
                  value={newTopic.sanPhamKyVong}
                  onChange={(e) => setNewTopic({...newTopic, sanPhamKyVong: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Ngày bắt đầu</label>
                  <input 
                    type="date" 
                    value={newTopic.ngayBatDau}
                    onChange={(e) => setNewTopic({...newTopic, ngayBatDau: e.target.value})}
                  />
                </div>
                <div className="form-group half">
                  <label>Hạn hoàn thành</label>
                  <input 
                    type="date" 
                    value={newTopic.ngayKetThuc}
                    onChange={(e) => setNewTopic({...newTopic, ngayKetThuc: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowTopicModal(false)}>Hủy bỏ</button>
              <button className="btn-save" onClick={handleAddTopic}>
                <FaSave /> Thêm đề tài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết nhóm */}
      {showGroupDetail && selectedGroup && (
        <div className="modal-overlay" onClick={() => setShowGroupDetail(false)}>
          <div className="modal-container large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔍 Chi tiết nhóm: {selectedGroup.tenNhom}</h3>
              <button className="modal-close" onClick={() => setShowGroupDetail(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>📋 Thông tin chung</h4>
                <div className="info-grid">
                  <div className="info-item"><label>Lớp:</label><span>{selectedGroup.tenLop}</span></div>
                  <div className="info-item"><label>Nhóm trưởng:</label><span>{selectedGroup.tenNhomTruong}</span></div>
                  <div className="info-item"><label>Số thành viên:</label><span>{selectedGroup.soThanhVien}</span></div>
                  <div className="info-item"><label>Trạng thái:</label><span className={`status-badge ${selectedGroup.trangThai}`}>{selectedGroup.trangThai === 'active' ? '✅ Đang hoạt động' : '⏸️ Đã kết thúc'}</span></div>
                </div>
              </div>

              {selectedGroup.tenDeTai && (
                <div className="detail-section">
                  <h4>📖 Đề tài</h4>
                  <div className="info-grid">
                    <div className="info-item"><label>Tên đề tài:</label><span>{selectedGroup.tenDeTai}</span></div>
                    <div className="info-item"><label>Mô tả:</label><span>{selectedGroup.moTaDeTai}</span></div>
                    <div className="info-item"><label>Sản phẩm:</label><span>{selectedGroup.sanPhamKyVong}</span></div>
                    <div className="info-item"><label>Thời gian:</label><span>{selectedGroup.ngayBatDauDeTai} → {selectedGroup.ngayKetThucDeTai}</span></div>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>👥 Danh sách thành viên</h4>
                <table className="member-table">
                  <thead>
                    <tr><th>STT</th><th>MSSV</th><th>Họ tên</th><th>Vai trò</th><th>Số công việc</th><th>Tiến độ</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>1</td><td>DH52200320</td><td>Đặng Võ Phương Anh</td><td>Nhóm trưởng</td><td>3</td><td><div className="progress-small"><div className="progress-fill-small" style={{ width: '80%' }}></div></div></td></tr>
                    <tr><td>2</td><td>DH52300086</td><td>Trần Quốc Anh</td><td>Thành viên</td><td>2</td><td><div className="progress-small"><div className="progress-fill-small" style={{ width: '60%' }}></div></div></td></tr>
                    <tr><td>3</td><td>DH52300101</td><td>Dương Hoàng Ân</td><td>Thành viên</td><td>2</td><td><div className="progress-small"><div className="progress-fill-small" style={{ width: '40%' }}></div></div></td></tr>
                  </tbody>
                </table>
              </div>

              <div className="detail-section">
                <h4>📝 Công việc đang thực hiện</h4>
                <div className="task-list">
                  <div className="task-item done">
                    <FaCheckCircle className="task-icon" />
                    <div><strong>Thiết kế giao diện</strong><p>Đặng Võ Phương Anh</p></div>
                    <span className="task-badge completed">Hoàn thành</span>
                  </div>
                  <div className="task-item">
                    <FaClock className="task-icon" />
                    <div><strong>Xây dựng CSDL</strong><p>Trần Quốc Anh</p></div>
                    <span className="task-badge progress">Đang thực hiện</span>
                  </div>
                  <div className="task-item">
                    <FaClock className="task-icon" />
                    <div><strong>Lập trình chức năng</strong><p>Dương Hoàng Ân</p></div>
                    <span className="task-badge pending">Chưa bắt đầu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
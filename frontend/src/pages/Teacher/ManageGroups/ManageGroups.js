import React, { useState, useEffect } from 'react';
import './ManageGroups.css';
import { FaPlus, FaSearch, FaUsers, FaUserFriends, FaCrown, FaRandom, FaUserPlus, FaUserMinus, FaTimes, FaChalkboard } from 'react-icons/fa';
import nhomService from '../../../services/nhomService';
import classService from '../../../services/classService';

const ManageGroups = () => {
  const [classes, setClasses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isAssignLeaderModalOpen, setIsAssignLeaderModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ groupName: '', maxMembers: 5 });
  const [selectedLeaderId, setSelectedLeaderId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const fetchClasses = async () => {
    try {
      const classData = await classService.getTeacherClasses();
      setClasses(classData);
      if (classData.length > 0) {
        setFilterClass(classData[0].maLop.toString());
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setIsLoading(false);
    }
  };

  const fetchGroupsAndStudents = async (classId) => {
    setIsLoading(true);
    try {
      const [groupData, studentData] = await Promise.all([
        nhomService.getGroupsByClass(classId),
        classService.getUnassignedStudents(classId)
      ]);
      setGroups(groupData);
      setUnassignedStudents(studentData);
    } catch (error) {
      console.error('Error fetching groups/students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (filterClass) {
      fetchGroupsAndStudents(filterClass);
    }
  }, [filterClass]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'maxMembers' ? parseInt(value) : value });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!filterClass) return alert('Vui lòng chọn lớp học trước');
    try {
      await nhomService.createGroup({
        tenNhom: formData.groupName,
        maLop: parseInt(filterClass),
        soThanhVienToiDa: formData.maxMembers
      });
      alert('Tạo nhóm thành công!');
      setIsCreateModalOpen(false);
      setFormData({ groupName: '', maxMembers: 5 });
      fetchGroupsAndStudents(filterClass);
    } catch (error) {
      alert(error.response?.data?.thongBao || 'Lỗi khi tạo nhóm');
    }
  };

  const handleRandomAssign = async () => {
    if (!filterClass) return;
    try {
      const res = await nhomService.randomAssign(parseInt(filterClass));
      alert(res.thongBao || 'Phân nhóm ngẫu nhiên thành công!');
      setIsRandomModalOpen(false);
      fetchGroupsAndStudents(filterClass);
    } catch (error) {
      alert(error.response?.data?.thongBao || 'Lỗi khi phân nhóm ngẫu nhiên');
    }
  };

  const handleAssignLeader = async () => {
    if (!selectedGroup) return;
    try {
      await nhomService.assignLeader(selectedGroup.maNhom, selectedLeaderId ? parseInt(selectedLeaderId) : null);
      alert('Cập nhật nhóm trưởng thành công!');
      setIsAssignLeaderModalOpen(false);
      fetchGroupsAndStudents(filterClass);
    } catch (error) {
      alert(error.response?.data?.thongBao || 'Lỗi khi cập nhật nhóm trưởng');
    }
  };

  const handleAddMember = async () => {
    if (!selectedStudentId || !selectedGroup) return;
    try {
      await nhomService.addMember(selectedGroup.maNhom, parseInt(selectedStudentId));
      alert('Thêm thành viên thành công!');
      setIsAddMemberModalOpen(false);
      fetchGroupsAndStudents(filterClass);
    } catch (error) {
      alert(error.response?.data?.thongBao || 'Lỗi khi thêm thành viên');
    }
  };

  const handleRemoveMember = async (groupId, userId) => {
    if (window.confirm('Xóa thành viên khỏi nhóm?')) {
      try {
        await nhomService.removeMember(groupId, userId);
        alert('Đã xóa thành viên khỏi nhóm');
        fetchGroupsAndStudents(filterClass);
      } catch (error) {
        alert(error.response?.data?.thongBao || 'Lỗi khi xóa thành viên');
      }
    }
  };

  const handleDeleteGroup = async (group) => {
    if (group.soThanhVienHienTai > 0) {
      alert('Không thể xóa vì nhóm đang có thành viên. Vui lòng xóa hết thành viên trước khi xóa nhóm.');
      return;
    }

    if (window.confirm('Bạn có chắc muốn xóa nhóm này? Dữ liệu không thể khôi phục.')) {
      try {
        await nhomService.deleteGroup(group.maNhom);
        alert('Xóa nhóm thành công');
        fetchGroupsAndStudents(filterClass);
      } catch (error) {
        if (error.response?.status === 500) {
          alert('Hệ thống từ chối xóa do nhóm đang có dữ liệu ràng buộc (có thể đã phát sinh lỗi hệ thống hoặc dữ liệu liên quan khác).');
        } else {
          alert(error.response?.data?.thongBao || 'Lỗi khi xóa nhóm');
        }
      }
    }
  };

  const openAssignLeader = (group) => {
    setSelectedGroup(group);
    setSelectedLeaderId(group.maNhomTruong?.toString() || '');
    setIsAssignLeaderModalOpen(true);
  };

  const openAddMember = (group) => {
    setSelectedGroup(group);
    setSelectedStudentId('');
    setIsAddMemberModalOpen(true);
  };

  // Filter groups locally by search term
  const filteredGroups = groups.filter(g => {
    return (g.tenNhom || '').toLowerCase().includes((searchTerm || '').toLowerCase());
  });

  // Stats
  const totalGroups = groups.length;
  const totalMembers = groups.reduce((sum, g) => sum + (g.thanhVien?.length || 0), 0);
  const groupsWithLeader = groups.filter(g => g.maNhomTruong).length;
  const groupsWithoutLeader = groups.filter(g => !g.maNhomTruong).length;

  if (isLoading) {
    return <div className="loading-state">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="manage-groups-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Nhóm học tập</h2>
          <p className="page-subtitle">Tạo nhóm, phân công thành viên và chỉ định nhóm trưởng</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setIsRandomModalOpen(true)}>
            <FaRandom /> Phân nhóm ngẫu nhiên
          </button>
          <button className="btn-primary" onClick={() => { setFormData({ groupName: '', maxMembers: 5 }); setIsCreateModalOpen(true); }}>
            <FaPlus /> Tạo nhóm mới
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar-row">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Tìm kiếm nhóm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          {classes.length === 0 ? (
            <option value="">Chưa có lớp học</option>
          ) : (
            classes.map(c => <option key={c.maLop} value={c.maLop}>{c.tenLop} ({c.maLopHoc})</option>)
          )}
        </select>
      </div>

      {/* THỐNG KÊ */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue"><FaUsers /></div>
          <div className="stat-info">
            <h4>Tổng nhóm</h4>
            <span className="stat-number">{totalGroups}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FaUserFriends /></div>
          <div className="stat-info">
            <h4>Tổng thành viên</h4>
            <span className="stat-number">{totalMembers}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><FaCrown /></div>
          <div className="stat-info">
            <h4>Có nhóm trưởng</h4>
            <span className="stat-number">{groupsWithLeader}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><FaChalkboard /></div>
          <div className="stat-info">
            <h4>Chưa có trưởng</h4>
            <span className="stat-number">{groupsWithoutLeader}</span>
          </div>
        </div>
      </div>

      {/* DANH SÁCH NHÓM */}
      {filteredGroups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <p>Không tìm thấy nhóm nào trong lớp này</p>
        </div>
      ) : (
        <div className="groups-grid">
          {filteredGroups.map(group => (
            <div className="group-card" key={group.maNhom}>
              <div className="group-card-top">
                <h3>{group.tenNhom}</h3>
                <span className="group-class-badge">{group.tenLop}</span>
              </div>

              <div className="group-card-body">
                <div className="group-info-row">
                  <div className="group-info-item">
                    <FaUsers className="info-icon" />
                    <span>Thành viên: <strong>{group.soThanhVienHienTai}/{group.soThanhVienToiDa}</strong></span>
                  </div>
                  {group.nhomTruong && group.nhomTruong !== "Chưa có" ? (
                    <span className="leader-badge">
                      <FaCrown className="crown-icon" /> {group.nhomTruong}
                    </span>
                  ) : (
                    <span className="leader-badge" style={{ background: '#fee2e2', color: '#dc2626' }}>
                      Chưa có trưởng nhóm
                    </span>
                  )}
                </div>

                <div className="member-list-mini">
                  <h4>Danh sách thành viên</h4>
                  {(!group.thanhVien || group.thanhVien.length === 0) ? (
                    <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>Chưa có thành viên</p>
                  ) : (
                    group.thanhVien.map(member => (
                      <div className="member-item" key={member.maNguoiDung}>
                        <div className="member-name">
                          <span>{member.hoTen}</span>
                          <span className="member-code">{member.maSo}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className={`member-role-tag ${member.vaiTroTrongNhom}`}>
                            {member.vaiTroTrongNhom === 'leader' ? '👑 Trưởng nhóm' : 'Thành viên'}
                          </span>
                          <button
                            className="btn-sm danger"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => handleRemoveMember(group.maNhom, member.maNguoiDung)}
                          >
                            <FaUserMinus />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="group-card-actions">
                <button className="btn-sm primary" onClick={() => openAddMember(group)}>
                  <FaUserPlus /> Thêm SV
                </button>
                <button className="btn-sm warning" onClick={() => openAssignLeader(group)}>
                  <FaCrown /> Chỉ định trưởng
                </button>
                <button className="btn-sm danger" onClick={() => handleDeleteGroup(group)}>
                  Xóa nhóm
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL TẠO NHÓM MỚI */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tạo nhóm mới</h3>
              <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateGroup}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Tên nhóm *</label>
                    <input type="text" name="groupName" value={formData.groupName} onChange={handleFormChange} placeholder="VD: Nhóm 4" required />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Số thành viên tối đa *</label>
                    <input type="number" name="maxMembers" value={formData.maxMembers} onChange={handleFormChange} min="2" max="20" required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsCreateModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-save">Tạo nhóm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PHÂN NHÓM NGẪU NHIÊN */}
      {isRandomModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRandomModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Phân nhóm ngẫu nhiên</h3>
              <button className="close-btn" onClick={() => setIsRandomModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="random-assign-info">
                <h4>📌 Cách hoạt động</h4>
                <p>Hệ thống sẽ tự động nhặt các sinh viên chưa có nhóm và điền ngẫu nhiên vào các nhóm đang có sẵn chỗ trống trong lớp này.</p>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 12 }}>
                Lớp hiện tại: <strong>{classes.find(c => c.maLop.toString() === filterClass)?.tenLop}</strong>
              </p>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
                SV chưa có nhóm: <strong>{unassignedStudents.length}</strong> người
              </p>
              {groups.length === 0 && (
                <p style={{ fontSize: 13, color: 'red', marginTop: 6 }}>
                  Lớp này chưa có nhóm nào được tạo. Vui lòng tạo các nhóm trống trước khi phân ngẫu nhiên.
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsRandomModalOpen(false)}>Hủy</button>
              <button className="btn-save" onClick={handleRandomAssign} disabled={groups.length === 0}>Phân nhóm ngẫu nhiên</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHỈ ĐỊNH NHÓM TRƯỞNG */}
      {isAssignLeaderModalOpen && selectedGroup && (
        <div className="modal-overlay" onClick={() => setIsAssignLeaderModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chỉ định nhóm trưởng - {selectedGroup.tenNhom}</h3>
              <button className="close-btn" onClick={() => setIsAssignLeaderModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Chọn thành viên làm nhóm trưởng:</label>
                <select value={selectedLeaderId} onChange={(e) => setSelectedLeaderId(e.target.value)}>
                  <option value="">-- Gỡ nhóm trưởng (Không có) --</option>
                  {(selectedGroup.thanhVien || []).map(m => (
                    <option key={m.maNguoiDung} value={m.maNguoiDung}>
                      {m.hoTen} ({m.maSo}) {m.maNguoiDung === selectedGroup.maNhomTruong ? '(Đang là trưởng)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAssignLeaderModalOpen(false)}>Hủy</button>
              <button className="btn-save" onClick={handleAssignLeader}>Cập nhật</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM THÀNH VIÊN */}
      {isAddMemberModalOpen && selectedGroup && (
        <div className="modal-overlay" onClick={() => setIsAddMemberModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm sinh viên vào {selectedGroup.tenNhom}</h3>
              <button className="close-btn" onClick={() => setIsAddMemberModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
                Số chỗ trống: <strong>{selectedGroup.soThanhVienToiDa - selectedGroup.soThanhVienHienTai}</strong>
              </p>
              <div className="form-group">
                <label>Chọn sinh viên (chưa có nhóm):</label>
                <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                  <option value="">-- Chọn sinh viên --</option>
                  {unassignedStudents.map(s => (
                    <option key={s.maNguoiDung} value={s.maNguoiDung}>{s.hoTen} ({s.maSo})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddMemberModalOpen(false)}>Hủy</button>
              <button className="btn-save" onClick={handleAddMember}>Thêm vào nhóm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGroups;

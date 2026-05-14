import React, { useState } from 'react';
import './ManageGroups.css';
import { FaPlus, FaSearch, FaUsers, FaUserFriends, FaCrown, FaRandom, FaUserPlus, FaUserMinus, FaTimes, FaChalkboard } from 'react-icons/fa';

// ===== DỮ LIỆU GIẢ LẬP =====
const initialGroups = [
  {
    groupId: 1, groupName: 'Nhóm 1', maxMembers: 5, classId: 1, className: 'Lập trình Web',
    leaderId: 101, leaderName: 'Nguyễn Văn An',
    members: [
      { userId: 101, userCode: 'SV001', fullName: 'Nguyễn Văn An', role: 'leader' },
      { userId: 102, userCode: 'SV002', fullName: 'Trần Thị Bình', role: 'member' },
      { userId: 103, userCode: 'SV003', fullName: 'Lê Hoàng Cường', role: 'member' },
      { userId: 104, userCode: 'SV004', fullName: 'Phạm Minh Đức', role: 'member' },
    ]
  },
  {
    groupId: 2, groupName: 'Nhóm 2', maxMembers: 5, classId: 1, className: 'Lập trình Web',
    leaderId: 105, leaderName: 'Hoàng Thị Hoa',
    members: [
      { userId: 105, userCode: 'SV005', fullName: 'Hoàng Thị Hoa', role: 'leader' },
      { userId: 106, userCode: 'SV006', fullName: 'Võ Thanh Hùng', role: 'member' },
      { userId: 107, userCode: 'SV007', fullName: 'Đặng Quốc Bảo', role: 'member' },
    ]
  },
  {
    groupId: 3, groupName: 'Nhóm 3', maxMembers: 5, classId: 1, className: 'Lập trình Web',
    leaderId: null, leaderName: null,
    members: [
      { userId: 108, userCode: 'SV008', fullName: 'Ngô Hải Yến', role: 'member' },
      { userId: 109, userCode: 'SV009', fullName: 'Lý Minh Tâm', role: 'member' },
    ]
  },
  {
    groupId: 4, groupName: 'Nhóm 1', maxMembers: 4, classId: 2, className: 'Cơ sở dữ liệu',
    leaderId: 201, leaderName: 'Đỗ Quang Khải',
    members: [
      { userId: 201, userCode: 'SV010', fullName: 'Đỗ Quang Khải', role: 'leader' },
      { userId: 202, userCode: 'SV011', fullName: 'Bùi Anh Tuấn', role: 'member' },
      { userId: 203, userCode: 'SV012', fullName: 'Trịnh Thu Hà', role: 'member' },
      { userId: 204, userCode: 'SV013', fullName: 'Mai Đức Thịnh', role: 'member' },
    ]
  },
];

const unassignedStudents = [
  { userId: 110, userCode: 'SV014', fullName: 'Phùng Thanh Tùng', classId: 1 },
  { userId: 111, userCode: 'SV015', fullName: 'Trương Bảo Ngọc', classId: 1 },
  { userId: 205, userCode: 'SV016', fullName: 'Cao Minh Phát', classId: 2 },
];

const ManageGroups = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isAssignLeaderModalOpen, setIsAssignLeaderModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    groupName: '', maxMembers: 5, classId: 1
  });
  const [randomForm, setRandomForm] = useState({ classId: 1, membersPerGroup: 4 });
  const [selectedLeaderId, setSelectedLeaderId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'maxMembers' || name === 'classId' ? parseInt(value) : value });
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const classNames = { 1: 'Lập trình Web', 2: 'Cơ sở dữ liệu' };
    const newGroup = {
      groupId: Date.now(),
      ...formData,
      className: classNames[formData.classId],
      leaderId: null, leaderName: null,
      members: []
    };
    setGroups([...groups, newGroup]);
    setIsCreateModalOpen(false);
    setFormData({ groupName: '', maxMembers: 5, classId: 1 });
    alert('Tạo nhóm thành công!');
  };

  const handleRandomAssign = () => {
    const classNames = { 1: 'Lập trình Web', 2: 'Cơ sở dữ liệu' };
    const studentsForClass = unassignedStudents.filter(s => s.classId === randomForm.classId);
    const numGroups = Math.ceil(studentsForClass.length / randomForm.membersPerGroup);

    if (studentsForClass.length === 0) {
      alert('Không có sinh viên chưa có nhóm trong lớp này!');
      return;
    }

    const newGroups = [];
    for (let i = 0; i < numGroups; i++) {
      newGroups.push({
        groupId: Date.now() + i,
        groupName: `Nhóm mới ${i + 1}`,
        maxMembers: randomForm.membersPerGroup,
        classId: randomForm.classId,
        className: classNames[randomForm.classId],
        leaderId: null, leaderName: null,
        members: studentsForClass.slice(i * randomForm.membersPerGroup, (i + 1) * randomForm.membersPerGroup)
          .map(s => ({ ...s, role: 'member' }))
      });
    }
    setGroups([...groups, ...newGroups]);
    setIsRandomModalOpen(false);
    alert(`Đã tạo ${numGroups} nhóm ngẫu nhiên với ${studentsForClass.length} sinh viên!`);
  };

  const handleAssignLeader = () => {
    if (!selectedLeaderId || !selectedGroup) return;
    const leaderId = parseInt(selectedLeaderId);
    const leader = selectedGroup.members.find(m => m.userId === leaderId);

    setGroups(groups.map(g => {
      if (g.groupId === selectedGroup.groupId) {
        return {
          ...g,
          leaderId: leaderId,
          leaderName: leader?.fullName || '',
          members: g.members.map(m => ({
            ...m,
            role: m.userId === leaderId ? 'leader' : 'member'
          }))
        };
      }
      return g;
    }));
    setIsAssignLeaderModalOpen(false);
    alert(`Đã chỉ định ${leader?.fullName} làm nhóm trưởng!`);
  };

  const handleAddMember = () => {
    if (!selectedStudentId || !selectedGroup) return;
    const student = unassignedStudents.find(s => s.userId === parseInt(selectedStudentId));
    if (!student) return;

    if (selectedGroup.members.length >= selectedGroup.maxMembers) {
      alert('Nhóm đã đạt số lượng thành viên tối đa!');
      return;
    }

    setGroups(groups.map(g => {
      if (g.groupId === selectedGroup.groupId) {
        return {
          ...g,
          members: [...g.members, { ...student, role: 'member' }]
        };
      }
      return g;
    }));
    setIsAddMemberModalOpen(false);
    alert(`Đã thêm ${student.fullName} vào ${selectedGroup.groupName}!`);
  };

  const handleRemoveMember = (groupId, userId) => {
    if (window.confirm('Xóa thành viên khỏi nhóm?')) {
      setGroups(groups.map(g => {
        if (g.groupId === groupId) {
          const updatedMembers = g.members.filter(m => m.userId !== userId);
          return {
            ...g,
            members: updatedMembers,
            leaderId: g.leaderId === userId ? null : g.leaderId,
            leaderName: g.leaderId === userId ? null : g.leaderName
          };
        }
        return g;
      }));
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Bạn có chắc muốn xóa nhóm này?')) {
      setGroups(groups.filter(g => g.groupId !== groupId));
    }
  };

  const openAssignLeader = (group) => {
    setSelectedGroup(group);
    setSelectedLeaderId(group.leaderId?.toString() || '');
    setIsAssignLeaderModalOpen(true);
  };

  const openAddMember = (group) => {
    setSelectedGroup(group);
    setSelectedStudentId('');
    setIsAddMemberModalOpen(true);
  };

  // Filter
  const filteredGroups = groups.filter(g => {
    const matchSearch = g.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = filterClass === 'all' || g.classId === parseInt(filterClass);
    return matchSearch && matchClass;
  });

  // Stats
  const totalGroups = groups.length;
  const totalMembers = groups.reduce((sum, g) => sum + g.members.length, 0);
  const groupsWithLeader = groups.filter(g => g.leaderId).length;
  const groupsWithoutLeader = groups.filter(g => !g.leaderId).length;

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
          <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <FaPlus /> Tạo nhóm mới
          </button>
        </div>
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

      {/* TOOLBAR */}
      <div className="toolbar-row">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Tìm kiếm nhóm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="all">Tất cả lớp</option>
          <option value="1">Lập trình Web</option>
          <option value="2">Cơ sở dữ liệu</option>
        </select>
      </div>

      {/* DANH SÁCH NHÓM */}
      {filteredGroups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <p>Không tìm thấy nhóm nào</p>
        </div>
      ) : (
        <div className="groups-grid">
          {filteredGroups.map(group => (
            <div className="group-card" key={group.groupId}>
              <div className="group-card-top">
                <h3>{group.groupName}</h3>
                <span className="group-class-badge">{group.className}</span>
              </div>

              <div className="group-card-body">
                <div className="group-info-row">
                  <div className="group-info-item">
                    <FaUsers className="info-icon" />
                    <span>Thành viên: <strong>{group.members.length}/{group.maxMembers}</strong></span>
                  </div>
                  {group.leaderName ? (
                    <span className="leader-badge">
                      <FaCrown className="crown-icon" /> {group.leaderName}
                    </span>
                  ) : (
                    <span className="leader-badge" style={{ background: '#fee2e2', color: '#dc2626' }}>
                      Chưa có trưởng nhóm
                    </span>
                  )}
                </div>

                <div className="member-list-mini">
                  <h4>Danh sách thành viên</h4>
                  {group.members.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>Chưa có thành viên</p>
                  ) : (
                    group.members.map(member => (
                      <div className="member-item" key={member.userId}>
                        <div className="member-name">
                          <span>{member.fullName}</span>
                          <span className="member-code">{member.userCode}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className={`member-role-tag ${member.role}`}>
                            {member.role === 'leader' ? '👑 Trưởng nhóm' : 'Thành viên'}
                          </span>
                          <button
                            className="btn-sm danger"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => handleRemoveMember(group.groupId, member.userId)}
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
                <button className="btn-sm danger" onClick={() => handleDeleteGroup(group.groupId)}>
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
                  <div className="form-group">
                    <label>Tên nhóm *</label>
                    <input type="text" name="groupName" value={formData.groupName} onChange={handleFormChange} placeholder="VD: Nhóm 4" required />
                  </div>
                  <div className="form-group">
                    <label>Số thành viên tối đa *</label>
                    <input type="number" name="maxMembers" value={formData.maxMembers} onChange={handleFormChange} min="2" max="10" required />
                  </div>
                  <div className="form-group full-width">
                    <label>Thuộc lớp *</label>
                    <select name="classId" value={formData.classId} onChange={handleFormChange}>
                      <option value="1">Lập trình Web</option>
                      <option value="2">Cơ sở dữ liệu</option>
                    </select>
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
                <p>Hệ thống sẽ tự động chia các sinh viên chưa có nhóm vào các nhóm mới dựa trên số lượng thành viên bạn chọn.</p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Chọn lớp *</label>
                  <select value={randomForm.classId} onChange={(e) => setRandomForm({ ...randomForm, classId: parseInt(e.target.value) })}>
                    <option value="1">Lập trình Web</option>
                    <option value="2">Cơ sở dữ liệu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Số SV mỗi nhóm *</label>
                  <input type="number" value={randomForm.membersPerGroup} onChange={(e) => setRandomForm({ ...randomForm, membersPerGroup: parseInt(e.target.value) })} min="2" max="10" />
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 12 }}>
                SV chưa có nhóm: <strong>{unassignedStudents.filter(s => s.classId === randomForm.classId).length}</strong> người
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsRandomModalOpen(false)}>Hủy</button>
              <button className="btn-save" onClick={handleRandomAssign}>Phân nhóm ngẫu nhiên</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHỈ ĐỊNH NHÓM TRƯỞNG */}
      {isAssignLeaderModalOpen && selectedGroup && (
        <div className="modal-overlay" onClick={() => setIsAssignLeaderModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chỉ định nhóm trưởng - {selectedGroup.groupName}</h3>
              <button className="close-btn" onClick={() => setIsAssignLeaderModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Chọn thành viên làm nhóm trưởng:</label>
                <select value={selectedLeaderId} onChange={(e) => setSelectedLeaderId(e.target.value)}>
                  <option value="">-- Chọn thành viên --</option>
                  {selectedGroup.members.map(m => (
                    <option key={m.userId} value={m.userId}>
                      {m.fullName} ({m.userCode}) {m.userId === selectedGroup.leaderId ? '(Đang là trưởng)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAssignLeaderModalOpen(false)}>Hủy</button>
              <button className="btn-save" onClick={handleAssignLeader}>Xác nhận chỉ định</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM THÀNH VIÊN */}
      {isAddMemberModalOpen && selectedGroup && (
        <div className="modal-overlay" onClick={() => setIsAddMemberModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm sinh viên vào {selectedGroup.groupName}</h3>
              <button className="close-btn" onClick={() => setIsAddMemberModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
                Số chỗ trống: <strong>{selectedGroup.maxMembers - selectedGroup.members.length}</strong>
              </p>
              <div className="form-group">
                <label>Chọn sinh viên:</label>
                <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                  <option value="">-- Chọn sinh viên --</option>
                  {unassignedStudents.filter(s => s.classId === selectedGroup.classId).map(s => (
                    <option key={s.userId} value={s.userId}>{s.fullName} ({s.userCode})</option>
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

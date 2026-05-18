import React, { useState, useEffect } from 'react';
import './Tracking.css';
import { FaChartLine, FaCheckCircle, FaSpinner, FaExclamationTriangle, FaClock, FaComments, FaStar, FaTasks, FaUsers, FaPaperclip, FaTimes, FaSave } from 'react-icons/fa';

import classService from '../../../services/classService';
import nhomService from '../../../services/nhomService';
import nhiemVuService from '../../../services/nhiemVuService';
import diemSoService from '../../../services/diemSoService';
import detaiService from '../../../services/deTaiService';

const Tracking = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState('all');

  const [groups, setGroups] = useState([]);
  const [tasksByGroup, setTasksByGroup] = useState({});
  const [diemSoByGroup, setDiemSoByGroup] = useState([]);
  const [topicsByGroup, setTopicsByGroup] = useState({});

  // Discussion state (mocked)
  const [selectedGroupChat, setSelectedGroupChat] = useState(null);

  // Evaluation state
  const [selectedGroupEval, setSelectedGroupEval] = useState(null);
  const [groupScore, setGroupScore] = useState(0);
  const [memberScores, setMemberScores] = useState({});
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [evaluatingGroup, setEvaluatingGroup] = useState(null);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getTeacherClasses();
        setClasses(data);
        if (data && data.length > 0) {
          setFilterClass(data[0].maLop.toString());
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch groups and tracking data when filterClass changes
  useEffect(() => {
    const fetchData = async () => {
      if (filterClass === 'all' || !filterClass) {
        setGroups([]);
        setTasksByGroup({});
        setDiemSoByGroup([]);
        setTopicsByGroup({});
        return;
      }
      try {
        // 1. Fetch groups
        const groupsData = await nhomService.getGroupsByClass(parseInt(filterClass));
        setGroups(groupsData);
        
        // Reset selections
        if (groupsData.length > 0) {
          setSelectedGroupChat(groupsData[0].maNhom);
          setSelectedGroupEval(groupsData[0].maNhom);
        } else {
          setSelectedGroupChat(null);
          setSelectedGroupEval(null);
        }

        // 2. Fetch tasks for each group
        const tasksMap = {};
        for (const group of groupsData) {
          try {
            const tasks = await nhiemVuService.getByGroup(group.maNhom);
            tasksMap[group.maNhom] = tasks;
          } catch (e) {
            tasksMap[group.maNhom] = [];
          }
        }
        setTasksByGroup(tasksMap);

        // 3. Fetch DiemSo
        try {
          const diemSoData = await diemSoService.getByLop(parseInt(filterClass));
          setDiemSoByGroup(diemSoData);
        } catch (e) {
          setDiemSoByGroup([]);
        }

        // 4. Fetch Topics to map topic name to group
        try {
          const topicsData = await detaiService.getByClass(parseInt(filterClass));
          const tMap = {};
          topicsData.forEach(t => {
            if (t.maNhom) {
              tMap[t.maNhom] = t.tenDeTai;
            }
          });
          setTopicsByGroup(tMap);
        } catch (e) {
          setTopicsByGroup({});
        }

      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };
    fetchData();
  }, [filterClass]);

  // Aggregate Data for UI
  const aggregatedGroups = groups.map(group => {
    const tasks = tasksByGroup[group.maNhom] || [];
    
    // Đếm trạng thái task
    let done = 0;
    let inProgress = 0;
    let overdue = 0;
    let pending = 0;
    
    const today = new Date();
    tasks.forEach(t => {
      if (t.trangThai === 'Hoàn thành') done++;
      else if (new Date(t.hanHoanThanh) < today) overdue++;
      else if (t.trangThai === 'Đang làm') inProgress++;
      else pending++;
    });
    
    const totalGroupTasks = tasks.length;
    const overallProgress = totalGroupTasks === 0 ? 0 : Math.round(tasks.reduce((sum, t) => sum + (t.phanTramHoanThanh || 0), 0) / totalGroupTasks);

    // Xử lý member progress
    const members = (group.thanhVien || []).map(member => {
      const memberTasks = tasks.filter(t => t.maNguoiDungs && t.maNguoiDungs.some(u => u.maNguoiDung === member.maNguoiDung));
      const memberDone = memberTasks.filter(t => t.trangThai === 'Hoàn thành').length;
      const progress = memberTasks.length === 0 ? 0 : Math.round(memberTasks.reduce((sum, t) => sum + (t.phanTramHoanThanh || 0), 0) / memberTasks.length);
      
      // Lấy điểm (nếu có)
      const ds = diemSoByGroup.find(d => d.maSinhVien === member.maNguoiDung && d.maNhom === group.maNhom);

      return {
        ...member,
        tasksCompleted: memberDone,
        progress: progress,
        diemCaNhan: ds ? ds.diemCaNhan : null,
        diemNhom: ds ? ds.diemNhom : null,
        maDiem: ds ? ds.maDiem : null
      };
    });

    return {
      ...group,
      topicName: topicsByGroup[group.maNhom] || '(Chưa đăng ký đề tài)',
      overallProgress,
      tasksStats: { done, inProgress, overdue, pending },
      members
    };
  });

  const totalTasks = aggregatedGroups.reduce((sum, g) => sum + g.tasksStats.done + g.tasksStats.inProgress + g.tasksStats.overdue + g.tasksStats.pending, 0);
  const completedTasks = aggregatedGroups.reduce((sum, g) => sum + g.tasksStats.done, 0);
  const overdueTasks = aggregatedGroups.reduce((sum, g) => sum + g.tasksStats.overdue, 0);
  const avgProgress = aggregatedGroups.length > 0
    ? Math.round(aggregatedGroups.reduce((sum, g) => sum + g.overallProgress, 0) / aggregatedGroups.length)
    : 0;

  const getProgressClass = (percent) => {
    if (percent >= 70) return 'high';
    if (percent >= 40) return 'medium';
    return 'low';
  };

  const openScoreModal = (group) => {
    setEvaluatingGroup(group);
    
    // Load existing scores
    const groupScore = group.members[0]?.diemNhom || 0;
    setGroupScore(groupScore);
    
    const mScores = {};
    group.members.forEach(m => {
      mScores[m.maNguoiDung] = m.diemCaNhan || 0;
    });
    setMemberScores(mScores);
    
    setIsScoreModalOpen(true);
  };

  const handleSaveScores = async () => {
    try {
      // Lấy thông tin giảng viên từ localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const maGiangVien = userInfo.maNguoiDung || 0;
      const tenGiangVien = userInfo.hoTen || 'Giảng viên';

      // Loop over members to save/update scores
      for (const member of evaluatingGroup.members) {
        const payload = {
          maSinhVien: member.maNguoiDung,
          tenSinhVien: member.hoTen || 'Sinh viên',
          maNhom: evaluatingGroup.maNhom,
          maLop: parseInt(filterClass),
          diemNhom: groupScore,
          diemCaNhan: memberScores[member.maNguoiDung] || 0,
          nhanXet: "Đã chấm điểm",
          maGiangVien: maGiangVien,
          tenGiangVien: tenGiangVien
        };

        if (member.maDiem) {
          // Update
          await diemSoService.update(member.maDiem, payload);
        } else {
          // Create
          await diemSoService.create(payload);
        }
      }

      alert('Đã lưu điểm đánh giá thành công!');
      setIsScoreModalOpen(false);
      
      // Refresh diemSo
      const diemSoData = await diemSoService.getByLop(parseInt(filterClass));
      setDiemSoByGroup(diemSoData);
      
    } catch (error) {
      alert('Lỗi khi lưu điểm: ' + (error.message || 'Unknown error'));
    }
  };

  const evalGroup = aggregatedGroups.find(g => g.maNhom === selectedGroupEval);

  return (
    <div className="tracking-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Giám sát & Đánh giá</h2>
          <p className="page-subtitle">Theo dõi tiến độ, giám sát thảo luận và đánh giá đóng góp của từng nhóm</p>
        </div>
      </div>

      {/* THỐNG KÊ */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue"><FaTasks /></div>
          <div className="stat-info">
            <h4>Tổng nhiệm vụ</h4>
            <span className="stat-number">{totalTasks}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FaCheckCircle /></div>
          <div className="stat-info">
            <h4>Hoàn thành</h4>
            <span className="stat-number">{completedTasks}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><FaExclamationTriangle /></div>
          <div className="stat-info">
            <h4>Trễ hạn</h4>
            <span className="stat-number">{overdueTasks}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><FaChartLine /></div>
          <div className="stat-info">
            <h4>Tiến độ TB</h4>
            <span className="stat-number">{avgProgress}%</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="toolbar-row">
        <div className="tabs-bar">
          <button className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>
            <FaChartLine /> Tiến độ nhóm
          </button>
          <button className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`} onClick={() => setActiveTab('discussion')}>
            <FaComments /> Giám sát thảo luận
          </button>
          <button className={`tab-btn ${activeTab === 'evaluation' ? 'active' : ''}`} onClick={() => setActiveTab('evaluation')}>
            <FaStar /> Đánh giá & Chấm điểm
          </button>
        </div>
        <select className="filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          {classes.map(c => (
            <option key={c.maLop} value={c.maLop}>{c.tenLop}</option>
          ))}
        </select>
      </div>

      {/* ======= TAB 1: TIẾN ĐỘ NHÓM ======= */}
      {activeTab === 'progress' && (
        <div className="progress-grid">
          {aggregatedGroups.length === 0 && <div style={{padding: '20px', color: '#666'}}>Không có nhóm nào trong lớp này.</div>}
          {aggregatedGroups.map(group => (
            <div className="progress-card" key={group.maNhom}>
              <div className="progress-card-header">
                <h3>{group.tenNhom} - {group.tenLop}</h3>
                <span className="topic-badge">{group.topicName}</span>
              </div>
              <div className="progress-card-body">
                {/* Thanh tiến độ tổng */}
                <div className="overall-progress">
                  <div className="overall-progress-label">
                    <span>Tiến độ tổng thể</span>
                    <strong>{group.overallProgress}%</strong>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className={`progress-bar-fill ${getProgressClass(group.overallProgress)}`}
                      style={{ width: `${group.overallProgress}%` }}
                    />
                  </div>
                </div>

                {/* Tóm tắt trạng thái task */}
                <div className="task-status-row">
                  <div className="task-status-item done">
                    <span className="status-count">{group.tasksStats.done}</span>
                    Hoàn thành
                  </div>
                  <div className="task-status-item in-progress">
                    <span className="status-count">{group.tasksStats.inProgress}</span>
                    Đang làm
                  </div>
                  <div className="task-status-item overdue">
                    <span className="status-count">{group.tasksStats.overdue}</span>
                    Trễ hạn
                  </div>
                  <div className="task-status-item pending">
                    <span className="status-count">{group.tasksStats.pending}</span>
                    Chờ làm
                  </div>
                </div>

                {/* Tiến độ từng thành viên */}
                <div className="member-progress-list">
                  <h4>Tiến độ thành viên</h4>
                  {group.members.length === 0 && <span style={{fontSize: 12, color: '#888'}}>Chưa có thành viên</span>}
                  {group.members.map(member => (
                    <div className="member-progress-item" key={member.maNguoiDung}>
                      <span className="member-name">
                        {member.vaiTroTrongNhom === 'leader' ? '👑 ' : ''}{member.hoTen}
                      </span>
                      <div className="mini-progress-track">
                        <div
                          className={`mini-progress-fill progress-bar-fill ${getProgressClass(member.progress)}`}
                          style={{ width: `${member.progress}%` }}
                        />
                      </div>
                      <span className="progress-percent">{member.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======= TAB 2: GIÁM SÁT THẢO LUẬN ======= */}
      {activeTab === 'discussion' && (
        <div className="discussion-section">
          {/* Sidebar danh sách nhóm */}
          <div className="group-list-panel">
            <h4>Nhóm học tập</h4>
            {aggregatedGroups.map(group => (
              <div
                key={group.maNhom}
                className={`group-list-item ${selectedGroupChat === group.maNhom ? 'active' : ''}`}
                onClick={() => setSelectedGroupChat(group.maNhom)}
              >
                <div className="group-avatar">{group.tenNhom.replace('Nhóm ', '')}</div>
                <div className="group-label">
                  <h5>{group.tenNhom}</h5>
                  <p>{group.tenLop}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Panel chat */}
          <div className="chat-panel">
            {selectedGroupChat ? (
              <>
                <div className="chat-panel-header">
                  <h4>{aggregatedGroups.find(g => g.maNhom === selectedGroupChat)?.tenNhom || 'Nhóm'} - Lịch sử thảo luận</h4>
                </div>
                <div className="chat-messages">
                    <div className="no-chat-selected">
                      <div className="no-chat-icon" style={{fontSize: '40px', marginBottom: '15px'}}>🚧</div>
                      <h4 style={{marginBottom: '10px'}}>Tính năng chưa được hỗ trợ</h4>
                      <p>Backend hiện tại chưa cung cấp API để lấy lịch sử tin nhắn của nhóm.</p>
                      <p>Chức năng này sẽ được cập nhật trong tương lai khi Backend sẵn sàng.</p>
                    </div>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <div className="no-chat-icon">💬</div>
                <p>Chọn một nhóm để xem lịch sử thảo luận</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======= TAB 3: ĐÁNH GIÁ & CHẤM ĐIỂM ======= */}
      {activeTab === 'evaluation' && (
        <div>
          <div className="toolbar-row" style={{ marginBottom: 16 }}>
            <select
              className="filter-select"
              value={selectedGroupEval || ''}
              onChange={(e) => setSelectedGroupEval(parseInt(e.target.value))}
            >
              {aggregatedGroups.map(g => (
                <option key={g.maNhom} value={g.maNhom}>{g.tenNhom} - {g.tenLop}</option>
              ))}
            </select>
            {evalGroup && (
              <button className="btn-primary" onClick={() => openScoreModal(evalGroup)}>
                <FaStar /> Chấm điểm
              </button>
            )}
          </div>

          {!evalGroup ? (
            <div style={{padding: '20px', color: '#666', background: '#fff', borderRadius: '8px', textAlign: 'center'}}>Không có dữ liệu nhóm để đánh giá.</div>
          ) : (
            <div className="evaluation-section">
              <div className="evaluation-header">
                <h3>{evalGroup.tenNhom} - {evalGroup.topicName}</h3>
                <span className={`badge-status ${evalGroup.overallProgress >= 70 ? 'active' : evalGroup.overallProgress >= 40 ? 'warning' : 'danger'}`}>
                  Tiến độ: {evalGroup.overallProgress}%
                </span>
              </div>

              <table className="evaluation-table">
                <thead>
                  <tr>
                    <th>Thành viên</th>
                    <th>Vai trò</th>
                    <th>Task hoàn thành</th>
                    <th>Tiến độ cá nhân</th>
                    <th>Điểm Tổng nhóm</th>
                    <th>Điểm Cá nhân</th>
                  </tr>
                </thead>
                <tbody>
                  {evalGroup.members.map(member => {
                    const contribution = member.progress;
                    return (
                      <tr key={member.maNguoiDung}>
                        <td><strong>{member.hoTen}</strong></td>
                        <td>{member.vaiTroTrongNhom === 'leader' ? '👑 Nhóm trưởng' : 'Thành viên'}</td>
                        <td style={{ textAlign: 'center' }}>{member.tasksCompleted}</td>
                        <td>
                          <div className="contribution-bar">
                            <div className="bar-track">
                              <div className={`bar-fill ${getProgressClass(member.progress)}`} style={{ width: `${member.progress}%` }} />
                            </div>
                            <span className="bar-value">{member.progress}%</span>
                          </div>
                        </td>
                        <td>
                          <span style={{fontWeight: 'bold', color: '#1e293b'}}>{member.diemNhom !== null ? member.diemNhom : '-'}</span>
                        </td>
                        <td>
                          <span style={{fontWeight: 'bold', color: '#0ea5e9'}}>{member.diemCaNhan !== null ? member.diemCaNhan : '-'}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {evalGroup.members.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '15px'}}>Nhóm chưa có thành viên.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL CHẤM ĐIỂM */}
      {isScoreModalOpen && evaluatingGroup && (
        <div className="modal-overlay" onClick={() => setIsScoreModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chấm điểm - {evaluatingGroup.tenNhom}</h3>
              <button className="close-btn" onClick={() => setIsScoreModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="group-score-row" style={{ borderRadius: 10, marginBottom: 20 }}>
                <label>Điểm tổng nhóm (0-10):</label>
                <input
                  type="number" className="score-input"
                  value={groupScore} onChange={(e) => setGroupScore(parseFloat(e.target.value))}
                  min="0" max="10" step="0.5"
                />
              </div>

              <h4 style={{ fontSize: 14, color: '#475569', marginBottom: 14 }}>Điểm cá nhân:</h4>
              {evaluatingGroup.members.map(member => (
                <div key={member.maNguoiDung} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 14, color: '#334155' }}>
                    {member.vaiTroTrongNhom === 'leader' ? '👑 ' : ''}{member.hoTen}
                  </span>
                  <input
                    type="number" className="score-input"
                    value={memberScores[member.maNguoiDung] === undefined ? '' : memberScores[member.maNguoiDung]}
                    onChange={(e) => setMemberScores({ ...memberScores, [member.maNguoiDung]: parseFloat(e.target.value) || 0 })}
                    min="0" max="10" step="0.5"
                    placeholder="0-10"
                  />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsScoreModalOpen(false)}>Hủy</button>
              <button className="btn-save" onClick={handleSaveScores}><FaSave style={{ marginRight: 6 }} /> Lưu điểm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;

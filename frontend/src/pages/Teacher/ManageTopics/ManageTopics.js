import React, { useState, useEffect } from 'react';
import './ManageTopics.css';
import { FaSearch, FaPlus, FaBook, FaEdit, FaTrash, FaCheckCircle, FaUserCheck, FaTimes } from 'react-icons/fa';
import detaiService from '../../../services/deTaiService';
import classService from '../../../services/classService';
import nhomService from '../../../services/nhomService';
import apiClient from '../../../services/apiClient';

const ManageTopics = () => {
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState('');
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTopic, setNewTopic] = useState({ tenDeTai: '', ngayBatDau: '', ngayKetThuc: '' });
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [groupsInClass, setGroupsInClass] = useState([]);
  const [assigningTopicId, setAssigningTopicId] = useState(null);
  const [selectedGroupForAssign, setSelectedGroupForAssign] = useState('');

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getTeacherClasses();
        setClasses(data);
        if (data.length > 0) {
          setFilterClass(data[0].maLop);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch topics
  const fetchTopics = async (classId) => {
    try {
      if (!classId) {
        setTopics([]);
        return;
      }
      const data = await detaiService.getByClass(classId);
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    if (filterClass) {
      fetchTopics(filterClass);
      // Fetch groups in class for assign feature
      const fetchGroups = async () => {
        try {
          const data = await nhomService.getGroupsByClass(filterClass);
          setGroupsInClass(data);
        } catch (e) {
          setGroupsInClass([]);
        }
      };
      fetchGroups();
    } else {
      setTopics([]);
      setGroupsInClass([]);
    }
  }, [filterClass]);

  const filteredTopics = topics.filter((topic) =>
    (topic.tenDeTai && topic.tenDeTai.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!filterClass) {
      alert('Vui lòng chọn lớp học trước.');
      return;
    }
    if (!newTopic.tenDeTai || !newTopic.ngayBatDau || !newTopic.ngayKetThuc) {
      alert('Vui lòng điền đầy đủ thông tin đề tài.');
      return;
    }

    try {
      if (editingTopicId !== null) {
        await detaiService.update(editingTopicId, {
          ...newTopic
        });
        alert('Đã cập nhật đề tài.');
        setEditingTopicId(null);
      } else {
        await detaiService.create({
          ...newTopic,
          maLop: filterClass,
          phuongThucGiao: 'Đăng ký tự do'
        });
        alert('Đã thêm đề tài mới.');
      }
      setNewTopic({ tenDeTai: '', ngayBatDau: '', ngayKetThuc: '' });
      fetchTopics(filterClass);
    } catch (error) {
      alert(error.message || 'Lỗi khi lưu đề tài');
    }
  };

  const handleEditClick = (topic) => {
    setEditingTopicId(topic.maDeTai);
    setNewTopic({
      tenDeTai: topic.tenDeTai || '',
      ngayBatDau: topic.ngayBatDau || '',
      ngayKetThuc: topic.ngayKetThuc || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingTopicId(null);
    setNewTopic({ tenDeTai: '', ngayBatDau: '', ngayKetThuc: '' });
  };

  const handleDeleteTopic = async (topic) => {
    if (topic.daCoNhom) {
      alert('Không thể xóa đề tài này vì đã có nhóm đăng ký.');
      return;
    }
    if (window.confirm('Bạn có chắc muốn xóa đề tài này?')) {
      try {
        await detaiService.delete(topic.maDeTai);
        alert('Xóa đề tài thành công');
        fetchTopics(filterClass);
      } catch (error) {
        if (error.message?.includes('ràng buộc')) {
          alert('Không thể xóa đề tài do lỗi ràng buộc hệ thống.');
        } else {
          alert(error.message || 'Lỗi khi xóa đề tài');
        }
      }
    }
  };

  const handleAssignTopic = async (topic) => {
    if (!selectedGroupForAssign) {
      alert('Vui lòng chọn nhóm để giao đề tài.');
      return;
    }
    try {
      await apiClient.post('/api/detai/cap-nhat-giao', {
        maDeTai: topic.maDeTai,
        maNhom: parseInt(selectedGroupForAssign),
        phuongThucGiao: 'Chỉ định trực tiếp'
      });
      alert('Đã giao đề tài cho nhóm thành công!');
      setAssigningTopicId(null);
      setSelectedGroupForAssign('');
      fetchTopics(filterClass);
    } catch (error) {
      alert(error.message || 'Lỗi khi giao đề tài');
    }
  };

  const handleUnassignTopic = async (topic) => {
    if (!window.confirm(`Bạn có chắc muốn gỡ nhóm "${topic.tenNhom}" khỏi đề tài này?`)) return;
    try {
      await apiClient.post('/api/detai/cap-nhat-giao', {
        maDeTai: topic.maDeTai,
        maNhom: 0,
        phuongThucGiao: 'Đăng ký tự do'
      });
      alert('Đã gỡ nhóm khỏi đề tài.');
      fetchTopics(filterClass);
    } catch (error) {
      alert(error.message || 'Lỗi khi gỡ nhóm');
    }
  };

  return (
    <div className="manage-topics-page">
      <div className="manage-topics-header">
        <div>
          <h2>Quản lý Đề tài</h2>
          <p>Quản lý danh sách đề tài cho giảng viên, thêm mới và xem trạng thái đề tài.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select
            className="class-filter-select"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }}
          >
            <option value="">-- Chọn lớp học --</option>
            {classes.map((cls) => (
              <option key={cls.maLop} value={cls.maLop}>
                {cls.tenLop} ({cls.maLopHoc})
              </option>
            ))}
          </select>
          <div className="manage-topics-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Tìm kiếm đề tài..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="manage-topics-body">
        <section className="topic-list-section">
          <div className="section-title">
            <FaBook />
            <h3>Danh sách đề tài</h3>
          </div>

          <div className="topic-list">
            {!filterClass ? (
              <div className="topic-empty">Vui lòng chọn lớp học để xem đề tài.</div>
            ) : filteredTopics.length === 0 ? (
              <div className="topic-empty">Không có đề tài phù hợp.</div>
            ) : (
              filteredTopics.map((topic) => {
                // Tính trạng thái dựa trên ngày
                const now = new Date();
                const startDate = new Date(topic.ngayBatDau);
                const endDate = new Date(topic.ngayKetThuc);
                let status = 'Chưa mở';
                let statusClass = 'closed';
                if (now >= startDate && now <= endDate) {
                  status = 'Đang mở';
                  statusClass = 'open';
                } else if (now > endDate) {
                  status = 'Đã đóng';
                  statusClass = 'closed';
                }

                return (
                  <div key={topic.maDeTai} className="topic-card">
                    <div className="topic-info">
                      <h4>{topic.tenDeTai}</h4>
                      <p>Thời gian: {topic.ngayBatDau} → {topic.ngayKetThuc}</p>
                      {topic.daCoNhom && (
                        <p style={{ color: 'green', fontSize: '13px', marginTop: '5px' }}>
                          <FaCheckCircle style={{ marginRight: '5px', verticalAlign: 'text-bottom' }} />
                          Đã được nhận bởi: {topic.tenNhom}
                        </p>
                      )}
                    </div>
                    <div className="topic-actions">
                      <span className={`topic-status topic-status-${statusClass}`}>
                        {status}
                      </span>
                      {!topic.daCoNhom ? (
                        <button className="btn-icon" title="Giao cho nhóm" style={{color: '#0ea5e9'}} onClick={() => { setAssigningTopicId(assigningTopicId === topic.maDeTai ? null : topic.maDeTai); setSelectedGroupForAssign(''); }}>
                          <FaUserCheck />
                        </button>
                      ) : (
                        <button className="btn-icon" title="Gỡ nhóm" style={{color: '#f97316'}} onClick={() => handleUnassignTopic(topic)}>
                          <FaTimes />
                        </button>
                      )}
                      <button className="btn-icon edit" title="Sửa đề tài" onClick={() => handleEditClick(topic)}>
                        <FaEdit />
                      </button>
                      <button className="btn-icon delete" title="Xóa đề tài" onClick={() => handleDeleteTopic(topic)}>
                        <FaTrash />
                      </button>
                    </div>

                    {/* Dropdown chọn nhóm */}
                    {assigningTopicId === topic.maDeTai && (
                      <div style={{marginTop: '10px', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                          <select
                            value={selectedGroupForAssign}
                            onChange={(e) => setSelectedGroupForAssign(e.target.value)}
                            style={{flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px'}}
                          >
                            <option value="">-- Chọn nhóm --</option>
                            {groupsInClass.map(g => (
                              <option key={g.maNhom} value={g.maNhom}>{g.tenNhom} ({g.soThanhVienHienTai}/{g.soThanhVienToiDa} SV)</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssignTopic(topic)}
                            style={{padding: '6px 14px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap'}}
                          >
                            Giao
                          </button>
                          <button
                            onClick={() => setAssigningTopicId(null)}
                            style={{padding: '6px 10px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'}}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="topic-add-section">
          <div className="section-title">
            {editingTopicId ? <FaEdit /> : <FaPlus />}
            <h3>{editingTopicId ? 'Sửa đề tài' : 'Thêm đề tài mới'}</h3>
          </div>

          <form className="topic-add-form" onSubmit={handleSubmit}>
            <label>
              Tên đề tài
              <input
                type="text"
                value={newTopic.tenDeTai}
                onChange={(e) => setNewTopic({ ...newTopic, tenDeTai: e.target.value })}
                placeholder="Nhập tên đề tài..."
              />
            </label>
            <label>
              Ngày bắt đầu
              <input
                type="date"
                value={newTopic.ngayBatDau}
                onChange={(e) => setNewTopic({ ...newTopic, ngayBatDau: e.target.value })}
              />
            </label>
            <label>
              Ngày kết thúc
              <input
                type="date"
                value={newTopic.ngayKetThuc}
                onChange={(e) => setNewTopic({ ...newTopic, ngayKetThuc: e.target.value })}
              />
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-add-topic" disabled={!filterClass}>
                {editingTopicId ? <><FaEdit /> Cập nhật</> : <><FaPlus /> Thêm đề tài</>}
              </button>
              {editingTopicId && (
                <button type="button" className="btn-add-topic" style={{ background: '#6b7280' }} onClick={handleCancelEdit}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ManageTopics;

import React, { useState, useEffect } from 'react';
import './ManageTopics.css';
import { FaSearch, FaPlus, FaBook, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import detaiService from '../../../services/deTaiService';
import classService from '../../../services/classService';

const ManageTopics = () => {
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState('');
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTopic, setNewTopic] = useState({ tenDeTai: '', ngayBatDau: '', ngayKetThuc: '' });
  const [editingTopicId, setEditingTopicId] = useState(null);

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
    } else {
      setTopics([]);
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
                      <button className="btn-icon edit" title="Sửa đề tài" onClick={() => handleEditClick(topic)}>
                        <FaEdit />
                      </button>
                      <button className="btn-icon delete" title="Xóa đề tài" onClick={() => handleDeleteTopic(topic)}>
                        <FaTrash />
                      </button>
                    </div>
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

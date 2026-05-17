import React, { useState } from 'react';
import './ManageTopics.css';
import { FaSearch, FaPlus, FaBook, FaEdit, FaTrash } from 'react-icons/fa';

const initialTopics = [
  { id: 1, title: 'Xây dựng hệ thống quản lý lớp học', teacher: 'Thầy Minh Khang', status: 'Đang mở', startDate: '2026-01-15', endDate: '2026-05-30' },
  { id: 2, title: 'Ứng dụng bán hàng trực tuyến', teacher: 'Thầy Minh Khang', status: 'Đã đóng', startDate: '2025-09-10', endDate: '2025-12-20' },
  { id: 3, title: 'Phân tích dữ liệu học tập', teacher: 'Thầy Minh Khang', status: 'Đang mở', startDate: '2026-02-01', endDate: '2026-06-10' }
];

const ManageTopics = () => {
  const [topics, setTopics] = useState(initialTopics);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTopic, setNewTopic] = useState({ title: '', startDate: '', endDate: '' });
  const [editingTopicId, setEditingTopicId] = useState(null);

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTopic.title || !newTopic.startDate || !newTopic.endDate) {
      alert('Vui lòng điền đầy đủ thông tin đề tài.');
      return;
    }

    if (editingTopicId !== null) {
      setTopics(topics.map(topic => 
        topic.id === editingTopicId ? { ...topic, title: newTopic.title, startDate: newTopic.startDate, endDate: newTopic.endDate } : topic
      ));
      setEditingTopicId(null);
      setNewTopic({ title: '', startDate: '', endDate: '' });
      alert('Đã cập nhật đề tài.');
    } else {
      const nextId = Math.max(0, ...topics.map((topic) => topic.id)) + 1;
      setTopics([
        ...topics,
        {
          id: nextId,
          title: newTopic.title,
          teacher: 'Thầy Minh Khang',
          status: 'Đang mở',
          startDate: newTopic.startDate,
          endDate: newTopic.endDate
        }
      ]);
      setNewTopic({ title: '', startDate: '', endDate: '' });
      alert('Đã thêm đề tài mới.');
    }
  };

  const handleEditClick = (topic) => {
    setEditingTopicId(topic.id);
    setNewTopic({ title: topic.title, startDate: topic.startDate, endDate: topic.endDate });
  };

  const handleCancelEdit = () => {
    setEditingTopicId(null);
    setNewTopic({ title: '', startDate: '', endDate: '' });
  };

  const handleDeleteTopic = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa đề tài này?')) {
      setTopics(topics.filter((topic) => topic.id !== id));
    }
  };

  return (
    <div className="manage-topics-page">
      <div className="manage-topics-header">
        <div>
          <h2>Quản lý Đề tài</h2>
          <p>Quản lý danh sách đề tài cho giảng viên, thêm mới và xem trạng thái đề tài.</p>
        </div>
        <div className="manage-topics-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm đề tài, trạng thái hoặc giảng viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="manage-topics-body">
        <section className="topic-list-section">
          <div className="section-title">
            <FaBook />
            <h3>Danh sách đề tài</h3>
          </div>

          <div className="topic-list">
            {filteredTopics.length === 0 ? (
              <div className="topic-empty">Không có đề tài phù hợp.</div>
            ) : (
              filteredTopics.map((topic) => (
                <div key={topic.id} className="topic-card">
                  <div className="topic-info">
                    <h4>{topic.title}</h4>
                    <p>Giảng viên: {topic.teacher}</p>
                    <p>Thời gian: {topic.startDate} → {topic.endDate}</p>
                  </div>
                  <div className="topic-actions">
                    <span className={`topic-status topic-status-${topic.status === 'Đang mở' ? 'open' : 'closed'}`}>
                      {topic.status}
                    </span>
                    <button className="btn-icon edit" title="Sửa đề tài" onClick={() => handleEditClick(topic)}>
                      <FaEdit />
                    </button>
                    <button className="btn-icon delete" title="Xóa đề tài" onClick={() => handleDeleteTopic(topic.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
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
                value={newTopic.title}
                onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                placeholder="Nhập tên đề tài..."
              />
            </label>
            <label>
              Ngày bắt đầu
              <input
                type="date"
                value={newTopic.startDate}
                onChange={(e) => setNewTopic({ ...newTopic, startDate: e.target.value })}
              />
            </label>
            <label>
              Ngày kết thúc
              <input
                type="date"
                value={newTopic.endDate}
                onChange={(e) => setNewTopic({ ...newTopic, endDate: e.target.value })}
              />
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-add-topic">
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

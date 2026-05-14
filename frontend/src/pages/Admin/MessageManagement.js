// MessageManagement.js - Sửa phần import
import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaTimes, FaComments, FaUser, FaUsers, 
  FaTrash, FaEye, FaReply, FaPaperPlane, FaBookOpen,
  FaChevronRight, FaArrowLeft, FaClock, FaReplyAll, 
  FaDownload, FaImage, FaComment
} from 'react-icons/fa';
import './styles/MessageManagement.css';

const MessageManagement = () => {
  const [classes, setClasses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  
  // State chọn lọc
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  // Dữ liệu mẫu từ database
  useEffect(() => {
    // Dữ liệu lớp học từ bảng LopHoc
    setClasses([
      { maLop: 1, tenLop: 'Lập trình Web', maLopHoc: 'LT_WEB_01', giangVien: 'Nguyễn Văn A', hocKy: 'HK2-2025' },
      { maLop: 2, tenLop: 'Cơ sở dữ liệu', maLopHoc: 'CSDL_01', giangVien: 'Trần Thị B', hocKy: 'HK2-2025' },
      { maLop: 3, tenLop: 'Lập trình Java', maLopHoc: 'JAVA_01', giangVien: 'Lê Hồng C', hocKy: 'HK2-2025' },
    ]);

    // Dữ liệu nhóm từ bảng Nhom
    setGroups([
      { maNhom: 1, tenNhom: 'Nhóm 1', maLop: 1, tenLop: 'Lập trình Web', soThanhVien: 5, nhomTruong: 'Đặng Võ Phương Anh' },
      { maNhom: 2, tenNhom: 'Nhóm 2', maLop: 1, tenLop: 'Lập trình Web', soThanhVien: 5, nhomTruong: 'Trần Quốc Anh' },
      { maNhom: 3, tenNhom: 'Nhóm 3', maLop: 1, tenLop: 'Lập trình Web', soThanhVien: 5, nhomTruong: 'Dương Hoàng Ân' },
      { maNhom: 4, tenNhom: 'Nhóm 1', maLop: 2, tenLop: 'Cơ sở dữ liệu', soThanhVien: 4, nhomTruong: 'Hồ Gia Bảo' },
      { maNhom: 5, tenNhom: 'Nhóm 2', maLop: 2, tenLop: 'Cơ sở dữ liệu', soThanhVien: 4, nhomTruong: 'Lâm Quốc Bảo' },
    ]);

    // Dữ liệu tin nhắn từ bảng TinNhan
    setMessages([
      { id: 1, maTinNhan: 1, maNhom: 1, maLop: 1, tenNhom: 'Nhóm 1', tenLop: 'Lập trình Web', maNguoiGui: 'DH52200320', nguoiGui: 'Đặng Võ Phương Anh', noiDung: 'Mọi người ơi, ai đã làm xong phần thiết kế giao diện chưa?', thoiGianGui: '2024-01-15 10:30:00', maTinNhanCha: null, soLuongPhanHoi: 3, tepDinhKem: 2 },
      { id: 2, maTinNhan: 2, maNhom: 1, maLop: 1, tenNhom: 'Nhóm 1', tenLop: 'Lập trình Web', maNguoiGui: 'DH52300086', nguoiGui: 'Trần Quốc Anh', noiDung: 'Mình đã xong phần database rồi, mọi người kiểm tra giúp nhé!', thoiGianGui: '2024-01-15 14:20:00', maTinNhanCha: null, soLuongPhanHoi: 2, tepDinhKem: 1 },
      { id: 3, maTinNhan: 3, maNhom: 1, maLop: 1, tenNhom: 'Nhóm 1', tenLop: 'Lập trình Web', maNguoiGui: 'DH52300101', nguoiGui: 'Dương Hoàng Ân', noiDung: '@Trần Quốc Anh ok để mình xem lại', thoiGianGui: '2024-01-15 15:45:00', maTinNhanCha: 2, soLuongPhanHoi: 0, tepDinhKem: 0 },
      { id: 4, maTinNhan: 4, maNhom: 2, maLop: 1, tenNhom: 'Nhóm 2', tenLop: 'Lập trình Web', maNguoiGui: 'DH52300141', nguoiGui: 'Hồ Gia Bảo', noiDung: 'Có ai biết cách xử lý file upload trong React không?', thoiGianGui: '2024-01-16 09:15:00', maTinNhanCha: null, soLuongPhanHoi: 4, tepDinhKem: 0 },
      { id: 5, maTinNhan: 5, maNhom: 2, maLop: 1, tenNhom: 'Nhóm 2', tenLop: 'Lập trình Web', maNguoiGui: 'DH52200360', nguoiGui: 'Lâm Quốc Bảo', noiDung: 'Mình biết nè, dùng axios hoặc fetch API nhé', thoiGianGui: '2024-01-16 10:20:00', maTinNhanCha: 4, soLuongPhanHoi: 0, tepDinhKem: 0 },
      { id: 6, maTinNhan: 6, maNhom: 4, maLop: 2, tenNhom: 'Nhóm 1', tenLop: 'Cơ sở dữ liệu', maNguoiGui: 'DH52200320', nguoiGui: 'Đặng Võ Phương Anh', noiDung: 'Các bạn đã làm bài tập nhóm chưa?', thoiGianGui: '2024-01-17 08:00:00', maTinNhanCha: null, soLuongPhanHoi: 2, tepDinhKem: 0 },
    ]);

    setUsers([
      { maNguoiDung: 'DH52200320', hoTen: 'Đặng Võ Phương Anh', vaiTro: 'Sinh viên', avatar: 'A' },
      { maNguoiDung: 'DH52300086', hoTen: 'Trần Quốc Anh', vaiTro: 'Sinh viên', avatar: 'T' },
      { maNguoiDung: 'DH52300101', hoTen: 'Dương Hoàng Ân', vaiTro: 'Sinh viên', avatar: 'D' },
      { maNguoiDung: 'DH52300141', hoTen: 'Hồ Gia Bảo', vaiTro: 'Sinh viên', avatar: 'H' },
      { maNguoiDung: 'DH52200360', hoTen: 'Lâm Quốc Bảo', vaiTro: 'Sinh viên', avatar: 'L' },
    ]);

    setLoading(false);
  }, []);

  // Lấy danh sách nhóm theo lớp đã chọn
  const groupsByClass = groups.filter(group => group.maLop === selectedClass?.maLop);

  // Lấy tin nhắn theo nhóm đã chọn
  const messagesByGroup = messages.filter(msg => msg.maNhom === selectedGroup?.maNhom);

  // Lọc tin nhắn theo từ khóa và ngày
  const filteredMessages = messagesByGroup.filter(msg => {
    const matchesSearch = msg.noiDung.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.nguoiGui.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || msg.thoiGianGui.split(' ')[0] === selectedDate;
    return matchesSearch && matchesDate;
  });

  // Xóa tin nhắn
  const deleteMessage = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tin nhắn này?')) {
      setMessages(messages.filter(msg => msg.id !== id));
      alert('Đã xóa tin nhắn thành công!');
    }
  };

  // Xem chi tiết tin nhắn
  const viewMessageDetail = (message) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
  };

  // Trả lời tin nhắn
  const handleReply = () => {
    if (!replyMessage.trim()) {
      alert('Vui lòng nhập nội dung trả lời!');
      return;
    }
    
    const newMessage = {
      id: messages.length + 1,
      maTinNhan: messages.length + 1,
      maNhom: selectedMessage.maNhom,
      maLop: selectedMessage.maLop,
      tenNhom: selectedMessage.tenNhom,
      tenLop: selectedMessage.tenLop,
      maNguoiGui: 'ADMIN001',
      nguoiGui: 'Quản trị viên',
      noiDung: replyMessage,
      thoiGianGui: new Date().toISOString().replace('T', ' ').slice(0, 19),
      maTinNhanCha: selectedMessage.maTinNhan,
      soLuongPhanHoi: 0,
      tepDinhKem: 0
    };
    
    setMessages([...messages, newMessage]);
    setReplyMessage('');
    setShowReplyModal(false);
    alert('Đã gửi phản hồi thành công!');
  };

  // Format ngày giờ
  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('vi-VN');
  };

  // Lấy tin nhắn cha
  const getParentMessage = (message) => {
    if (!message.maTinNhanCha) return null;
    return messages.find(m => m.maTinNhan === message.maTinNhanCha);
  };

  // Reset về bước chọn lớp
  const resetSelection = () => {
    setSelectedClass(null);
    setSelectedGroup(null);
    setSearchTerm('');
    setSelectedDate('');
  };

  // Quay lại chọn nhóm
  const backToGroup = () => {
    setSelectedGroup(null);
    setSearchTerm('');
    setSelectedDate('');
  };

  if (loading) {
    return <div className="loading-state">Đang tải dữ liệu...</div>;
  }

  // Bước 1: Chưa chọn lớp → Hiển thị danh sách lớp
  if (!selectedClass) {
    return (
      <div className="message-management">
        <div className="page-header-modern">
          <div className="header-content">
            <h2>Quản lý tin nhắn</h2>
            <p>Chọn lớp học để xem tin nhắn của các nhóm</p>
          </div>
        </div>

        <div className="class-selection-container">
          <h3 className="selection-title">
            <FaBookOpen /> Danh sách lớp học
          </h3>
          <div className="class-cards-grid">
            {classes.map(classItem => (
              <div 
                key={classItem.maLop} 
                className="class-select-card"
                onClick={() => setSelectedClass(classItem)}
              >
                <div className="class-card-icon">
                  <FaBookOpen />
                </div>
                <div className="class-card-info">
                  <h4>{classItem.tenLop}</h4>
                  <p className="class-code">{classItem.maLopHoc}</p>
                  <p className="class-teacher">Giảng viên: {classItem.giangVien}</p>
                  <p className="class-semester">{classItem.hocKy}</p>
                </div>
                <div className="class-card-arrow">
                  <FaChevronRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Bước 2: Đã chọn lớp, chưa chọn nhóm → Hiển thị danh sách nhóm của lớp đó
  if (selectedClass && !selectedGroup) {
    return (
      <div className="message-management">
        <div className="page-header-modern">
          <div className="header-content">
            <button className="back-button" onClick={resetSelection}>
              <FaArrowLeft /> Quay lại chọn lớp
            </button>
            <h2>Lớp: {selectedClass.tenLop}</h2>
            <p>Chọn nhóm để xem tin nhắn thảo luận</p>
          </div>
        </div>

        <div className="group-selection-container">
          <h3 className="selection-title">
            <FaUsers /> Danh sách nhóm
          </h3>
          <div className="group-cards-grid">
            {groupsByClass.map(group => {
              const groupMessages = messages.filter(m => m.maNhom === group.maNhom);
              return (
                <div 
                  key={group.maNhom} 
                  className="group-select-card"
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="group-card-icon">
                    <FaUsers />
                  </div>
                  <div className="group-card-info">
                    <h4>{group.tenNhom}</h4>
                    <p className="group-leader">Nhóm trưởng: {group.nhomTruong}</p>
                    <p className="group-members">{group.soThanhVien} thành viên</p>
                    <p className="group-messages-count">
                      <FaComments /> {groupMessages.length} tin nhắn
                    </p>
                  </div>
                  <div className="group-card-arrow">
                    <FaChevronRight />
                  </div>
                </div>
              );
            })}
          </div>
          {groupsByClass.length === 0 && (
            <div className="empty-state">
              <p>Lớp học này chưa có nhóm nào</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Bước 3: Đã chọn nhóm → Hiển thị tin nhắn của nhóm
  return (
    <div className="message-management">
      <div className="page-header-modern">
        <div className="header-content">
          <button className="back-button" onClick={backToGroup}>
            <FaArrowLeft /> Quay lại chọn nhóm
          </button>
          <h2>Nhóm: {selectedGroup.tenNhom}</h2>
          <p>Lớp: {selectedClass.tenLop} | Nhóm trưởng: {selectedGroup.nhomTruong}</p>
        </div>
      </div>

      {/* Thống kê tin nhắn của nhóm */}
      <div className="message-stats-group">
        <div className="stat-card-mini">
          <div className="stat-icon-mini blue"><FaComments /></div>
          <div className="stat-info-mini">
            <h4>Tổng tin nhắn</h4>
            <p className="stat-number-mini">{messagesByGroup.length}</p>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini green"><FaComment  /></div>
          <div className="stat-info-mini">
            <h4>Chủ đề</h4>
            <p className="stat-number-mini">{messagesByGroup.filter(m => !m.maTinNhanCha).length}</p>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini orange"><FaReplyAll /></div>
          <div className="stat-info-mini">
            <h4>Phản hồi</h4>
            <p className="stat-number-mini">{messagesByGroup.filter(m => m.maTinNhanCha).length}</p>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini purple"><FaUser /></div>
          <div className="stat-info-mini">
            <h4>Thành viên</h4>
            <p className="stat-number-mini">{selectedGroup.soThanhVien}</p>
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="message-toolbar">
        <div className="search-filter-group">
          <div className="search-box-modern">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tin nhắn..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FaTimes />
              </button>
            )}
          </div>
          
          <input 
            type="date" 
            className="filter-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Danh sách tin nhắn */}
      <div className="messages-list-container">
        {filteredMessages.map(message => {
          const parentMessage = getParentMessage(message);
          return (
            <div key={message.id} className={`message-item ${message.maTinNhanCha ? 'reply-item' : 'thread-item'}`}>
              <div className="message-avatar">
                <div className="avatar-placeholder">
                  {users.find(u => u.maNguoiDung === message.maNguoiGui)?.avatar || 'U'}
                </div>
              </div>
              <div className="message-content-wrapper">
                <div className="message-header">
                  <div className="message-sender">
                    <strong>{message.nguoiGui}</strong>
                    <span className="message-role">
                      {users.find(u => u.maNguoiDung === message.maNguoiGui)?.vaiTro || 'Sinh viên'}
                    </span>
                  </div>
                  <div className="message-meta">
                    <span className="message-time">
                      <FaClock size={10} /> {formatDate(message.thoiGianGui)}
                    </span>
                  </div>
                </div>
                
                {parentMessage && (
                  <div className="message-reply-to">
                    <FaReply className="reply-icon" />
                    <span>Trả lời: <em>{parentMessage.nguoiGui}</em> - {parentMessage.noiDung.substring(0, 80)}...</span>
                  </div>
                )}
                
                <div className="message-body">
                  <p>{message.noiDung}</p>
                  {message.tepDinhKem > 0 && (
                    <div className="message-attachments">
                      <span className="attachment-badge"><FaImage /> {message.tepDinhKem} tệp đính kèm</span>
                    </div>
                  )}
                </div>
                
                <div className="message-actions">
                  <button className="msg-action-btn view" onClick={() => viewMessageDetail(message)}>
                    <FaEye /> Chi tiết
                  </button>
                  <button className="msg-action-btn reply" onClick={() => {
                    setSelectedMessage(message);
                    setShowReplyModal(true);
                  }}>
                    <FaReply /> Phản hồi
                  </button>
                  <button className="msg-action-btn delete" onClick={() => deleteMessage(message.id)}>
                    <FaTrash /> Xóa
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredMessages.length === 0 && (
        <div className="empty-state">
          <FaComments className="empty-icon" />
          <p>Chưa có tin nhắn nào trong nhóm này</p>
        </div>
      )}

      {/* Modal chi tiết tin nhắn (giữ nguyên) */}
      {showDetailModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-container large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết tin nhắn</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin tin nhắn</h4>
                <div className="info-grid">
                  <div className="info-item"><label>Người gửi:</label><span>{selectedMessage.nguoiGui}</span></div>
                  <div className="info-item"><label>Nhóm:</label><span>{selectedMessage.tenNhom}</span></div>
                  <div className="info-item"><label>Thời gian:</label><span>{formatDate(selectedMessage.thoiGianGui)}</span></div>
                  {selectedMessage.maTinNhanCha && (
                    <div className="info-item"><label>Trả lời tin:</label><span>#{selectedMessage.maTinNhanCha}</span></div>
                  )}
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Nội dung</h4>
                <div className="message-full-content">{selectedMessage.noiDung}</div>
              </div>
              
              {selectedMessage.tepDinhKem > 0 && (
                <div className="detail-section">
                  <h4>Tệp đính kèm</h4>
                  <div className="attachments-list">
                    <div className="attachment-item"><FaDownload /> bai_tap.docx - 2.5 MB</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal trả lời */}
      {showReplyModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Phản hồi tin nhắn</h3>
              <button className="modal-close" onClick={() => setShowReplyModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="original-message">
                <strong>{selectedMessage.nguoiGui}:</strong>
                <p>{selectedMessage.noiDung}</p>
              </div>
              <div className="form-group">
                <label>Nội dung phản hồi</label>
                <textarea 
                  className="reply-textarea"
                  rows="5"
                  placeholder="Nhập nội dung phản hồi..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowReplyModal(false)}>Hủy</button>
              <button className="btn-save" onClick={handleReply}>
                <FaPaperPlane /> Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageManagement;
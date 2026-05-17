// components/SemesterManager.jsx
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaStar, FaSave, FaTimes } from 'react-icons/fa';
import './styles/SystemSettings.css';

const SemesterManager = () => {
  const [hocKys, setHocKys] = useState([]);
  const [newHocKy, setNewHocKy] = useState({ 
    tenHocKy: '', 
    ngayBatDau: '', 
    ngayKetThuc: '' 
  });
  const [editingHocKy, setEditingHocKy] = useState(null);
  const [editFormData, setEditFormData] = useState({ 
    tenHocKy: '', 
    ngayBatDau: '', 
    ngayKetThuc: '' 
  });

  useEffect(() => {
    fetchHocKys();
  }, []);

  const fetchHocKys = async () => {
    try {
      const res = await fetch('http://localhost:5186/api/hocky');
      if (res.ok) {
        setHocKys(await res.json());
      }
    } catch (err) {
      console.error('Lỗi fetch học kỳ:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleAddHocKy = async () => {
    if (!newHocKy.tenHocKy.trim()) {
      alert('Vui lòng nhập tên học kỳ');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5186/api/hocky', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...newHocKy, laHienTai: false })
      });
      
      if (res.ok) {
        fetchHocKys();
        setNewHocKy({ tenHocKy: '', ngayBatDau: '', ngayKetThuc: '' });
      } else {
        const error = await res.json();
        alert(error.thongBao || 'Lỗi thêm học kỳ');
      }
    } catch (err) {
      console.error('Lỗi thêm học kỳ:', err);
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleSetCurrentHocKy = async (id) => {
    try {
      const res = await fetch(`http://localhost:5186/api/hocky/${id}/set-current`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      
      if (res.ok) {
        fetchHocKys();
      } else {
        alert('Lỗi phân quyền hoặc server');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ');
    }
  };

  const startEditHocKy = (hk) => {
    setEditingHocKy(hk.maHocKy);
    setEditFormData({
      tenHocKy: hk.tenHocKy,
      ngayBatDau: hk.ngayBatDau || '',
      ngayKetThuc: hk.ngayKetThuc || ''
    });
  };

  const handleUpdateHocKy = async (id) => {
    if (!editFormData.tenHocKy.trim()) {
      alert('Vui lòng nhập tên học kỳ');
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5186/api/hocky/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editFormData)
      });
      
      if (res.ok) {
        fetchHocKys();
        setEditingHocKy(null);
      } else {
        const error = await res.json();
        alert(error.thongBao || 'Lỗi cập nhật học kỳ');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ');
    }
  };

  const cancelEdit = () => {
    setEditingHocKy(null);
    setEditFormData({ tenHocKy: '', ngayBatDau: '', ngayKetThuc: '' });
  };

  return (
    <div className="settings-card" style={{ gridColumn: '1 / -1', marginTop: '30px' }}>
      <div className="card-header" style={{ background: '#f8fafc', color: '#1e293b' }}>
        <div className="card-icon" style={{ background: '#e2e8f0', color: '#3b82f6' }}>
          <FaCalendarAlt />
        </div>
        <h3>Quản lý Năm học - Học kỳ</h3>
      </div>
      
      <div className="card-body" style={{ padding: '20px' }}>
        {/* Form thêm mới */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <input 
            type="text" 
            placeholder="Tên học kỳ (VD: HK1 2025-2026)" 
            value={newHocKy.tenHocKy} 
            onChange={e => setNewHocKy({ ...newHocKy, tenHocKy: e.target.value })} 
            style={{ 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              flex: 1,
              minWidth: '200px'
            }} 
          />
          <input 
            type="date" 
            title="Ngày bắt đầu" 
            value={newHocKy.ngayBatDau} 
            onChange={e => setNewHocKy({ ...newHocKy, ngayBatDau: e.target.value })} 
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
          <input 
            type="date" 
            title="Ngày kết thúc" 
            value={newHocKy.ngayKetThuc} 
            onChange={e => setNewHocKy({ ...newHocKy, ngayKetThuc: e.target.value })} 
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
          <button 
            onClick={handleAddHocKy} 
            style={{ 
              background: '#10b981', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 15px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            + Thêm Học Kỳ
          </button>
        </div>

        {/* Bảng danh sách học kỳ */}
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '27%' }} />
          </colgroup>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                Tên học kỳ
              </th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                Thời gian (dd/mm/yyyy)
              </th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                Trạng thái
              </th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {hocKys.map((hk, idx) => (
              <tr 
                key={hk.maHocKy} 
                style={{ 
                  background: hk.laHienTai ? '#ecfdf5' : (idx % 2 === 0 ? '#fff' : '#fafafa'), 
                  borderBottom: '1px solid #e2e8f0' 
                }}
              >
                {editingHocKy === hk.maHocKy ? (
                  // Mode chỉnh sửa
                  <React.Fragment>
                    <td style={{ padding: '8px 14px' }}>
                      <input 
                        type="text" 
                        value={editFormData.tenHocKy} 
                        onChange={e => setEditFormData({...editFormData, tenHocKy: e.target.value})} 
                        style={{ 
                          width: '100%', 
                          padding: '5px 8px', 
                          border: '1px solid #cbd5e1', 
                          borderRadius: '4px', 
                          boxSizing: 'border-box', 
                          fontSize: '13px' 
                        }} 
                      />
                    </td>
                    <td style={{ padding: '8px 14px' }}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <input 
                          type="date" 
                          value={editFormData.ngayBatDau} 
                          onChange={e => setEditFormData({...editFormData, ngayBatDau: e.target.value})} 
                          style={{ 
                            padding: '5px', 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '4px', 
                            flex: 1, 
                            fontSize: '12px' 
                          }} 
                        />
                        <span style={{ color: '#94a3b8' }}>–</span>
                        <input 
                          type="date" 
                          value={editFormData.ngayKetThuc} 
                          onChange={e => setEditFormData({...editFormData, ngayKetThuc: e.target.value})} 
                          style={{ 
                            padding: '5px', 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '4px', 
                            flex: 1, 
                            fontSize: '12px' 
                          }} 
                        />
                      </div>
                    </td>
                    <td style={{ padding: '8px 14px', color: '#94a3b8', fontSize: '13px' }}>–</td>
                    <td style={{ padding: '8px 14px' }}>
                      <button 
                        onClick={() => handleUpdateHocKy(hk.maHocKy)} 
                        style={{ 
                          background: '#10b981', 
                          color: 'white', 
                          padding: '5px 12px', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer', 
                          marginRight: '6px', 
                          fontSize: '13px', 
                          fontWeight: '500' 
                        }}
                      >
                        <FaSave size={12} style={{ marginRight: '4px' }} /> Lưu
                      </button>
                      <button 
                        onClick={cancelEdit} 
                        style={{ 
                          background: '#e2e8f0', 
                          color: '#475569', 
                          padding: '5px 12px', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer', 
                          fontSize: '13px' 
                        }}
                      >
                        <FaTimes size={12} style={{ marginRight: '4px' }} /> Hủy
                      </button>
                    </td>
                  </React.Fragment>
                ) : (
                  // Mode hiển thị
                  <React.Fragment>
                    <td style={{ padding: '10px 14px', fontWeight: hk.laHienTai ? '700' : '500', color: '#1e293b', fontSize: '14px' }}>
                      {hk.tenHocKy}
                      {hk.laHienTai && (
                        <FaStar color="#f59e0b" style={{ marginLeft: '6px', verticalAlign: 'middle', fontSize: '12px' }} />
                      )}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#475569', fontSize: '13px', fontFamily: 'monospace' }}>
                      {formatDate(hk.ngayBatDau)} – {formatDate(hk.ngayKetThuc)}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      {hk.laHienTai ? (
                        <span style={{ 
                          background: '#d1fae5', 
                          color: '#065f46', 
                          padding: '3px 8px', 
                          borderRadius: '10px', 
                          fontSize: '12px', 
                          fontWeight: '600' 
                        }}>
                          Hiện tại
                        </span>
                      ) : (
                        <span style={{ 
                          background: '#f1f5f9', 
                          color: '#64748b', 
                          padding: '3px 8px', 
                          borderRadius: '10px', 
                          fontSize: '12px' 
                        }}>
                          Đã đóng
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      <button 
                        onClick={() => startEditHocKy(hk)} 
                        style={{ 
                          background: '#fef3c7', 
                          color: '#92400e', 
                          padding: '5px 12px', 
                          border: '1px solid #fcd34d', 
                          borderRadius: '4px', 
                          cursor: 'pointer', 
                          marginRight: '6px', 
                          fontSize: '13px', 
                          fontWeight: '500' 
                        }}
                      >
                        Sửa
                      </button>
                      {!hk.laHienTai && (
                        <button 
                          onClick={() => handleSetCurrentHocKy(hk.maHocKy)} 
                          style={{ 
                            background: '#dbeafe', 
                            color: '#1e40af', 
                            padding: '5px 12px', 
                            border: '1px solid #93c5fd', 
                            borderRadius: '4px', 
                            cursor: 'pointer', 
                            fontSize: '13px', 
                            fontWeight: '500' 
                          }}
                        >
                          Đặt hiện tại
                        </button>
                      )}
                    </td>
                  </React.Fragment>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {hocKys.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            Chưa có học kỳ nào. Hãy thêm học kỳ đầu tiên!
          </div>
        )}
      </div>
    </div>
  );
};

export default SemesterManager;
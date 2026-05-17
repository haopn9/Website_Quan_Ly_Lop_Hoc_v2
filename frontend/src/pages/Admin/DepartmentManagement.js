// components/DepartmentOnly.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaBuilding } from 'react-icons/fa';
import './styles/UserManagement.css';

const DepartmentOnly = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [deptDetails, setDeptDetails] = useState(null);

  // Thêm Khoa
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');

  // Sửa Khoa
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [editDeptName, setEditDeptName] = useState('');
  const [editDeptCode, setEditDeptCode] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDeptId) {
      fetchDeptDetails(selectedDeptId);
    } else {
      setDeptDetails(null);
    }
  }, [selectedDeptId]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('http://localhost:5186/api/khoa');
      if (res.ok) setDepartments(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDeptDetails = async (id) => {
    try {
      const res = await fetch(`http://localhost:5186/api/khoa/${id}`);
      if (res.ok) setDeptDetails(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // KHOA
  // ==========================================
  const handleAddDept = async () => {
    if (!newDeptName || !newDeptCode) return alert('Vui lòng nhập tên và ký hiệu khoa');
    try {
      const res = await fetch('http://localhost:5186/api/khoa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tenKhoa: newDeptName, kyHieuKhoa: newDeptCode })
      });
      if (res.ok) {
        fetchDepartments();
        setNewDeptName('');
        setNewDeptCode('');
      } else {
        const err = await res.json();
        alert(err.thongBao || 'Lỗi thêm khoa');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi kết nối máy chủ');
    }
  };

  const startEditDept = (dept) => {
    setEditingDeptId(dept.maKhoa);
    setEditDeptName(dept.tenKhoa);
    setEditDeptCode(dept.kyHieuKhoa || '');
  };

  const handleUpdateDept = async () => {
    if (!editDeptName || !editDeptCode) return alert('Vui lòng nhập tên và ký hiệu khoa');
    try {
      const res = await fetch(`http://localhost:5186/api/khoa/${editingDeptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tenKhoa: editDeptName, kyHieuKhoa: editDeptCode })
      });
      if (res.ok) {
        fetchDepartments();
        if (selectedDeptId === editingDeptId) fetchDeptDetails(editingDeptId);
        setEditingDeptId(null);
      } else {
        const err = await res.json();
        alert(err.thongBao || 'Lỗi cập nhật khoa');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleDeleteDept = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khoa này?')) return;
    try {
      const res = await fetch(`http://localhost:5186/api/khoa/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        if (selectedDeptId === id) setSelectedDeptId(null);
        fetchDepartments();
      } else {
        const err = await res.json();
        alert(err.thongBao || 'Không thể xóa khoa');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi kết nối máy chủ');
    }
  };

  return (
    <div style={{ padding: '20px', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Quản lý Khoa</h2>
        <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Quản lý danh sách các khoa trong trường</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 160px)' }}>
        {/* CỘT TRÁI - Danh sách Khoa */}
        <div style={{ width: '380px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
              <FaBuilding color="#3b82f6" /> Danh sách Khoa
            </h3>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input 
                type="text" 
                placeholder="Mã Khoa" 
                value={newDeptCode} 
                onChange={e => setNewDeptCode(e.target.value)} 
                style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
              />
              <input 
                type="text" 
                placeholder="Tên Khoa mới" 
                value={newDeptName} 
                onChange={e => setNewDeptName(e.target.value)} 
                style={{ flex: 1, padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
              />
              <button 
                onClick={handleAddDept} 
                style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0 10px' }}
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '10px' }}>
            {departments.map(dept => (
              <div
                key={dept.maKhoa}
                onClick={() => setSelectedDeptId(dept.maKhoa)}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '6px',
                  border: `1px solid ${selectedDeptId === dept.maKhoa ? '#3b82f6' : '#e2e8f0'}`,
                  background: selectedDeptId === dept.maKhoa ? '#eff6ff' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  {editingDeptId === dept.maKhoa ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input 
                          type="text" 
                          value={editDeptCode} 
                          onChange={e => setEditDeptCode(e.target.value)} 
                          style={{ width: '80px', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
                          placeholder="Mã" 
                        />
                        <input 
                          type="text" 
                          value={editDeptName} 
                          onChange={e => setEditDeptName(e.target.value)} 
                          style={{ flex: 1, padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
                          placeholder="Tên khoa" 
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '5px', marginTop: '2px' }}>
                        <button 
                          onClick={handleUpdateDept} 
                          style={{ background: '#10b981', color: 'white', padding: '4px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Lưu
                        </button>
                        <button 
                          onClick={() => setEditingDeptId(null)} 
                          style={{ background: '#6b7280', color: 'white', padding: '4px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontWeight: 'bold', color: selectedDeptId === dept.maKhoa ? '#1d4ed8' : '#334155' }}>
                        {dept.kyHieuKhoa ? `[${dept.kyHieuKhoa}] ` : ''}{dept.tenKhoa}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        {dept.soLuongLop} Lớp HC • {dept.soLuongGiangVien} GV
                      </div>
                    </>
                  )}
                </div>
                {editingDeptId !== dept.maKhoa && (
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); startEditDept(dept); }} 
                      style={{ background: 'transparent', border: 'none', color: '#f59e0b', cursor: 'pointer', padding: '2px' }}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteDept(dept.maKhoa); }} 
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI - Chi tiết Khoa */}
        <div style={{ flex: 1, background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {deptDetails ? (
            <div style={{ padding: '20px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>
                Chi tiết Khoa {deptDetails.tenKhoa} {deptDetails.kyHieuKhoa ? `(${deptDetails.kyHieuKhoa})` : ''}
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '15px',
                marginBottom: '30px'
              }}>
                <div style={{ 
                  padding: '20px', 
                  background: '#f8fafc', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {deptDetails.lopHanhChinhs?.length || 0}
                  </div>
                  <div style={{ color: '#64748b', marginTop: '5px' }}>Lớp Hành Chính</div>
                </div>
                
                <div style={{ 
                  padding: '20px', 
                  background: '#f8fafc', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                    {deptDetails.giangViens?.length || 0}
                  </div>
                  <div style={{ color: '#64748b', marginTop: '5px' }}>Giảng Viên</div>
                </div>
                
                <div style={{ 
                  padding: '20px', 
                  background: '#f8fafc', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {deptDetails.sinhViens?.length || 0}
                  </div>
                  <div style={{ color: '#64748b', marginTop: '5px' }}>Sinh Viên</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
              <FaBuilding size={48} style={{ marginBottom: '15px', opacity: 0.2 }} />
              <p>Chọn một khoa ở danh sách bên trái để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentOnly;
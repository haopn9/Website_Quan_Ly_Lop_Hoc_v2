import apiClient from './apiClient';

const nhomService = {
  // Lấy danh sách nhóm theo lớp
  getGroupsByClass: async (classId) => {
    const response = await apiClient.get(`/api/nhom?maLop=${classId}`);
    return response.data || response;
  },

  // Lấy chi tiết nhóm
  getGroupDetail: async (groupId) => {
    const response = await apiClient.get(`/api/nhom/${groupId}`);
    return response.data || response;
  },

  // Tạo nhóm mới
  createGroup: async (data) => {
    const response = await apiClient.post('/api/nhom', data);
    return response.data || response;
  },

  // Xóa nhóm
  deleteGroup: async (groupId) => {
    const response = await apiClient.delete(`/api/nhom/${groupId}`);
    return response.data || response;
  },

  // Thêm thành viên vào nhóm
  addMember: async (groupId, studentId) => {
    const response = await apiClient.post(`/api/nhom/${groupId}/themthanhvien`, { maSinhVien: studentId });
    return response.data || response;
  },

  // Xóa thành viên khỏi nhóm
  removeMember: async (groupId, studentId) => {
    const response = await apiClient.delete(`/api/nhom/${groupId}/xoathanhvien/${studentId}`);
    return response.data || response;
  },

  // Đặt nhóm trưởng
  assignLeader: async (groupId, studentId) => {
    const response = await apiClient.put(`/api/nhom/${groupId}/nhomtruong`, { maSinhVien: studentId });
    return response.data || response;
  },

  // Phân nhóm ngẫu nhiên
  randomAssign: async (classId) => {
    const response = await apiClient.post('/api/nhom/phan-nhom-ngau-nhien', { maLop: classId });
    return response.data || response;
  }
};

export default nhomService;

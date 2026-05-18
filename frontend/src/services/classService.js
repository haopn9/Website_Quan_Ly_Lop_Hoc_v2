import apiClient from './apiClient';

const classService = {
  // Lấy danh sách lớp học do giảng viên phụ trách
  getTeacherClasses: async () => {
    const response = await apiClient.get('/api/lophoc/cua-toi');
    return response.data || response;
  },

  // Lấy chi tiết lớp học
  getClassById: async (id) => {
    const response = await apiClient.get(`/api/lophoc/${id}`);
    return response.data || response;
  },

  // Tạo lớp học mới
  createClass: async (data) => {
    const response = await apiClient.post('/api/lophoc', data);
    return response.data || response;
  },

  // Cập nhật lớp học
  updateClass: async (id, data) => {
    const response = await apiClient.put(`/api/lophoc/${id}`, data);
    return response.data || response;
  },

  // Xóa lớp học
  deleteClass: async (id) => {
    const response = await apiClient.delete(`/api/lophoc/${id}`);
    return response.data || response;
  },

  // Lấy danh sách học kỳ
  getSemesters: async () => {
    const response = await apiClient.get('/api/lophoc/hocky');
    return response.data || response;
  },

  // Xóa sinh viên khỏi lớp
  removeStudentFromClass: async (maLop, maSinhVien) => {
    const response = await apiClient.delete(`/api/lophoc/${maLop}/sinhvien/${maSinhVien}`);
    return response.data || response;
  },

  // Lấy danh sách sinh viên chưa có nhóm
  getUnassignedStudents: async (maLop) => {
    const response = await apiClient.get(`/api/lophoc/${maLop}/sinhvien-chua-co-nhom`);
    return response.data || response;
  }
};

export default classService;

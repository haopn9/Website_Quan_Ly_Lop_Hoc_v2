import apiClient from './apiClient';

const diemSoService = {
  getByLop: async (maLop) => {
    try {
      const response = await apiClient.get(`/api/DiemSo/by-lop/${maLop}`);
      return response;
    } catch (error) {
      if (error.message && error.message.includes("Không tìm thấy")) {
        return [];
      }
      throw error;
    }
  },
  create: async (data) => {
    const response = await apiClient.post('/api/DiemSo', data);
    return response;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/DiemSo/${id}`, data);
    return response;
  }
};

export default diemSoService;

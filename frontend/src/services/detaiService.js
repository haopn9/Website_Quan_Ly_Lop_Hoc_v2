import apiClient from './apiClient';

const detaiService = {
  // Lấy danh sách đề tài theo mã lớp
  getByClass: async (maLop) => {
    const response = await apiClient.get(`/api/detai/lop/${maLop}`);
    return response;
  },

  // Tạo đề tài mới (dùng FormData do API yêu cầu [FromForm])
  create: async (data) => {
    const formData = new FormData();
    formData.append('TenDeTai', data.tenDeTai);
    if (data.moTa) formData.append('MoTa', data.moTa);
    if (data.sanPhamKyVong) formData.append('SanPhamKyVong', data.sanPhamKyVong);
    formData.append('MaLop', data.maLop);
    if (data.ngayBatDau) formData.append('NgayBatDau', data.ngayBatDau);
    if (data.ngayKetThuc) formData.append('NgayKetThuc', data.ngayKetThuc);
    if (data.phuongThucGiao) formData.append('PhuongThucGiao', data.phuongThucGiao);

    const response = await apiClient.post('/api/detai', formData, true);
    return response;
  },

  // Cập nhật đề tài (dùng JSON do API yêu cầu [FromBody])
  update: async (maDeTai, data) => {
    const payload = {
      tenDeTai: data.tenDeTai,
      moTa: data.moTa,
      sanPhamKyVong: data.sanPhamKyVong,
      ngayBatDau: data.ngayBatDau,
      ngayKetThuc: data.ngayKetThuc
    };
    const response = await apiClient.put(`/api/detai/${maDeTai}`, payload);
    return response;
  },

  // Xóa đề tài
  delete: async (maDeTai) => {
    const response = await apiClient.delete(`/api/detai/${maDeTai}`);
    return response;
  }
};

export default detaiService;

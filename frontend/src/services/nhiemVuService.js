import apiClient from './apiClient';

const nhiemVuService = {
  getByGroup: async (maNhom) => {
    try {
      const response = await apiClient.get(`/api/nhiemvu?maNhom=${maNhom}`);
      return response;
    } catch (error) {
      if (error.message && error.message.includes("Không tìm thấy")) return [];
      throw error;
    }
  }
};

export default nhiemVuService;

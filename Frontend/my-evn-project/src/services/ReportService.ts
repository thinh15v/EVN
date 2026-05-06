import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ReportService = {
  getReports: async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/Reports/list`, {
        method: 'GET',
        headers: {
        }
      });

      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Lỗi gọi API getReports:", error);
      throw error;
    }
  },

  // Sau này bạn có thể viết thêm hàm createReport, uploadFile vào đây...
};
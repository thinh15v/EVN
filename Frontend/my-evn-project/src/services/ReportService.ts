import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ReportService = {
  getReports: async () => {
    try {
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

createReport: async (payload: any) => {
    try {
      const response = await fetch(`${API_URL}/Reports/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',},
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorDetails = Object.values(data.errors).flat().join(' | ');
          throw new Error(`Dữ liệu không hợp lệ: ${errorDetails}`);
        }
        throw new Error(data.message || data.title || 'Lỗi từ máy chủ API C#');
      }

      return data;
    } catch (error) {
      console.error("Lỗi gọi API createReport:", error);
      throw error;
    }
  },
  // Lấy thông tin chi tiết và tiến độ của báo cáo
  getReportDetail: async (id: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/Reports/${id}/timeline`, { // Gọi API timeline của bạn
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi lấy chi tiết báo cáo:", error);
      throw error;
    }
  },

  // Lấy danh sách file tổng hợp của Admin
  getFinalFiles: async (id: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/Reports/${id}/final-files`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi lấy file tổng hợp:", error);
      throw error;
    }
  },
  // Lấy chi tiết báo cáo và danh sách file của các Ban
  getReportDetailAdmin: async (id: number) => {
    try {
      const token = Cookies.get("accessToken");
      // Gọi đúng đuôi /detail mà mình vừa viết ở C#
      const response = await fetch(`${API_URL}/Reports/${id}/detail`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi lấy chi tiết báo cáo Admin:", error);
      throw error;
    }
  },
  // Thêm hàm này vào ReportService
  getReportsByDept: async (deptId: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/Reports/dept/${deptId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi lấy danh sách báo cáo theo Ban:", error);
      throw error;
    }
  },
};
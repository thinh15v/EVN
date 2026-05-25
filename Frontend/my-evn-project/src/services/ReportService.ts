import axiosClient from '@/utils/axiosClient';
import { ApiResponse, ReportCreatePayload } from '@/types/report';

export const ReportService = {
  // Hàm gọi API lấy danh sách báo cáo (cho trang ReportList)
  getReports: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosClient.get<ApiResponse<any[]>>('/api/Reports/list');
    return response.data;
  },

  // Hàm gọi API tạo báo cáo mới (cho trang CreateReport)
  createReport: async (payload: ReportCreatePayload): Promise<ApiResponse<any>> => {
    const response = await axiosClient.post<ApiResponse<any>>('/api/Reports/create', payload);
    return response.data;
  },

  // Lấy thông tin chi tiết và tiến độ của báo cáo
  getReportDetail: async (id: number): Promise<ApiResponse<any>> => {
    const response = await axiosClient.get<ApiResponse<any>>(`/api/Reports/${id}/timeline`);
    return response.data;
  },

  // Lấy danh sách file tổng hợp của Admin
  getFinalFiles: async (id: number): Promise<any> => {
    const response = await axiosClient.get(`/api/Reports/${id}/final-files`);
    return response.data;
  },

  // Lấy chi tiết báo cáo và danh sách file của các Ban
  getReportDetailAdmin: async (id: number): Promise<any> => {
    const response = await axiosClient.get(`/api/Reports/${id}/detail`);
    return response.data;
  },

  // Lấy danh sách báo cáo theo Ban (cho trang DeptReportList)
  getReportsByDept: async (deptId: number): Promise<ApiResponse<any[]>> => {
    const response = await axiosClient.get<ApiResponse<any[]>>(`/api/Reports/dept/${deptId}`);
    return response.data;
  },

  // API: Khóa toàn bộ báo cáo (cho Admin)
  lockAllAssignments: async (reportId: number): Promise<any> => {
    const response = await axiosClient.put(`/api/Reports/${reportId}/lock-all`);
    return response.data;
  },

  // API: Cập nhật lại danh sách các Ban được phân công
  updateAssignments: async (reportId: number, departmentIds: number[]): Promise<any> => {
    const response = await axiosClient.put(`/api/Reports/${reportId}/assignments`, { departmentIds });
    return response.data;
  },

  // Mở khóa phân công
  unlockAssignment: async (payload: { assignmentId: number, userId: number, reason: string }): Promise<any> => {
    const response = await axiosClient.post('/api/Reports/unlock', payload);
    return response.data;
  },

  // Lấy timeline báo cáo
  getReportTimeline: async (reportId: number): Promise<any> => {
    const response = await axiosClient.get(`/api/Reports/${reportId}/timeline`);
    return response.data;
  },

  // Hàm mới: Lấy chi tiết báo cáo và tiến độ của Ban kỹ thuật (cho trang DeptReportDetail)
  getReportDetailForDept: async (reportId: number): Promise<any> => {
    try {
      const response = await axiosClient.get<any>(`/api/Reports/${reportId}/detail`);
      const res = response.data as any;

      if (!res || !res.data) return { success: false, message: "Không có dữ liệu" };

      // Bóc tách dữ liệu
      const reportData = res.data.report || res.data.Report;
      const assignmentsList = res.data.assignments || res.data.Assignments || [];
      
      // Tìm Ban kỹ thuật (ID = 2)
      let myAssignment = assignmentsList.find((a: any) => (a.deptId === 2 || a.DeptId === 2));

      // DỰ PHÒNG: Nếu vẫn undefined, lấy đại thằng đầu tiên để trang web không bị lỗi
      if (!myAssignment && assignmentsList.length > 0) {
        myAssignment = assignmentsList[0];
      }

      return {
        success: true,
        data: {
          report: reportData,
          assignment: myAssignment
        }
      };
    } catch (error: any) {
      return { success: false, message: error.message || "Lỗi kết nối" };
    }
  },

  /**
   * Upload file báo cáo (Nhân viên thực hiện)
   */
  uploadReportFile: async (formData: FormData): Promise<any> => {
    try {
      // Bổ sung tham số thứ 3 là { headers: ... } để ép kiểu multipart
      const response = await axiosClient.post('/api/Reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Upload error:", error);
      return { success: false, message: error.message || "Lỗi khi tải file lên" };
    }
  },

  // Hàm mới: Lấy danh sách phiên bản file của một báo cáo (cho trang DeptReportDetail)
  getReportVersions: async (reportId: number, deptId: number): Promise<any> => {
    const response = await axiosClient.get(`/api/Reports/${reportId}/versions/${deptId}`);
    return response.data;
  },

  // API: Duyệt báo cáo (cho Lãnh đạo Ban)
  approveReport: async (payload: any): Promise<any> => {
    const response = await axiosClient.post('/api/Reports/approve', payload);
    return response.data;
  },

  // API: Lấy link tải file (cho tất cả các trang có file đính kèm)
  getDownloadLink: async (filePath: string): Promise<any> => {
    const response = await axiosClient.get(`/api/Reports/download-link?filePath=${encodeURIComponent(filePath)}`);
    return response.data;
  },

  // Upload file tổng hợp của Admin
  uploadFinalFile: async (reportId: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post(`/api/Reports/${reportId}/final-files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Xóa file tổng hợp của Admin
  deleteFinalFile: async (fileId: number): Promise<any> => {
    const response = await axiosClient.delete(`/api/Reports/final-files/${fileId}`);
    return response.data;
  }
};
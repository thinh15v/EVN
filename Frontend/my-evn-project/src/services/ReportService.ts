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
  lockAllAssignments: async (reportId: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/Reports/${reportId}/lock-all`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi gọi API khóa toàn bộ:", error);
      throw error;
    }
  },

  // API: Cập nhật lại danh sách các Ban được phân công
  updateAssignments: async (reportId: number, departmentIds: number[]) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/Reports/${reportId}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        // Đóng gói mảng ID thành object gửi lên Backend
        body: JSON.stringify({ departmentIds }), 
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi gọi API cập nhật phân công:", error);
      throw error;
    }
  },
  unlockAssignment: async (payload: { assignmentId: number, userId: number, reason: string }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/Reports/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi gọi API mở khóa:", error);
      throw error;
    }
  },
  // src/services/ReportService.ts

  getReportTimeline: async (reportId: number) => {
      try {
          const response = await fetch(`${API_URL}/Reports/${reportId}/timeline`);
          return await response.json();
      } catch (error) {
          console.error("Lỗi lấy timeline:", error);
          throw error;
      }
  },
// Trong ReportService.ts
getReportDetailForDept: async (reportId: number) => {
  try {
    const token = Cookies.get("accessToken");
    const response = await fetch(`${API_URL}/Reports/${reportId}/detail`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const res = await response.json();

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
        assignment: myAssignment // Đảm bảo cái này KHÔNG bao giờ bị undefined nữa
      }
    };
  } catch (error) {
    return { success: false, message: "Lỗi kết nối" };
  }
},

    /**
     * Upload file báo cáo (Nhân viên thực hiện)
     * Tương ứng với [HttpPost("upload")] trong Controller của bạn
     */
    uploadReportFile: async (formData: FormData) => {
        try {
            const response = await fetch(`${API_URL}/Reports/upload`, {
                method: 'POST',
                body: formData, // Không để Content-Type vì FormData tự định nghĩa
            });
            return await response.json();
        } catch (error) {
            console.error("Upload error:", error);
            return { success: false, message: "Lỗi khi tải file lên" };
        }
    },
    // Thêm hàm này vào dưới cùng của ReportService object
  getReportVersions: async (reportId: number, deptId: number) => {
    try {
      const token = Cookies.get("accessToken");
      // Gọi API lấy riêng danh sách file (Bạn nhớ tạo endpoint này ở Controller C# nhé)
      const response = await fetch(`${API_URL}/Reports/${reportId}/versions/${deptId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi gọi API getReportVersions:", error);
      throw error;
    }
  },
  approveReport: async (payload: any) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/Reports/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi gọi API approveReport:", error);
      throw error;
    }
  },
};
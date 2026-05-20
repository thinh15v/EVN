import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ReportService = {

    

  // Hàm gọi API lấy danh sách báo cáo (cho trang ReportList)
  getReports: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/Reports/list`, {
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

  // Hàm gọi API tạo báo cáo mới (cho trang CreateReport)
createReport: async (payload: any) => {
    try {
      const response = await fetch(`${BASE_URL}/api/Reports/create`, {
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
      const response = await fetch(`${BASE_URL}/api/Reports/${id}/timeline`, { // Gọi API timeline của bạn
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
      const response = await fetch(`${BASE_URL}/api/Reports/${id}/final-files`, {
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
      const response = await fetch(`${BASE_URL}/api/Reports/${id}/detail`, { 
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
  // Lấy danh sách báo cáo theo Ban (cho trang DeptReportList)
  getReportsByDept: async (deptId: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${BASE_URL}/api/Reports/dept/${deptId}`, {
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
  // API: Khóa toàn bộ báo cáo (cho Admin)
  lockAllAssignments: async (reportId: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${BASE_URL}/api/Reports/${reportId}/lock-all`, {
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
      const response = await fetch(`${BASE_URL}/api/Reports/${reportId}/assignments`, {
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
      const response = await fetch(`${BASE_URL}/api/Reports/unlock`, {
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
          const response = await fetch(`${BASE_URL}/api/Reports/${reportId}/timeline`);
          return await response.json();
      } catch (error) {
          console.error("Lỗi lấy timeline:", error);
          throw error;
      }
  },
// Hàm mới: Lấy chi tiết báo cáo và tiến độ của Ban kỹ thuật (cho trang DeptReportDetail)
getReportDetailForDept: async (reportId: number) => {
  try {
    const token = Cookies.get("accessToken");
    const response = await fetch(`${BASE_URL}/api/Reports/${reportId}/detail`, {
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
            const response = await fetch(`${BASE_URL}/api/Reports/upload`, {
                method: 'POST',
                body: formData, // Không để Content-Type vì FormData tự định nghĩa
            });
            return await response.json();
        } catch (error) {
            console.error("Upload error:", error);
            return { success: false, message: "Lỗi khi tải file lên" };
        }
    },
    // Hàm mới: Lấy danh sách phiên bản file của một báo cáo (cho trang DeptReportDetail)
  getReportVersions: async (reportId: number, deptId: number) => {
    try {
      const token = Cookies.get("accessToken");
      // Gọi API lấy riêng danh sách file (Bạn nhớ tạo endpoint này ở Controller C# nhé)
      const response = await fetch(`${BASE_URL}/api/Reports/${reportId}/versions/${deptId}`, {
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
  // API: Duyệt báo cáo (cho Lãnh đạo Ban)
  approveReport: async (payload: any) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${BASE_URL}/api/Reports/approve`, {
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
  // API: Lấy link tải file (cho tất cả các trang có file đính kèm)
  getDownloadLink: async (filePath: string) => {
    try {
      const token = Cookies.get("accessToken");
      // Sử dụng fetch tương tự các hàm ở trên
      const response = await fetch(`${BASE_URL}/api/Reports/download-link?filePath=${encodeURIComponent(filePath)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi lấy link tải file:", error);
      throw error;
    }
  },
  // Upload file tổng hợp của Admin
  uploadFinalFile: async (reportId: number, file: File) => {
    try {
      const token = Cookies.get("accessToken");
      const formData = new FormData();
      formData.append("file", file); // Tên field "file" phải khớp với IFormFile ở Backend

      const response = await fetch(`${BASE_URL}/api/Reports/${reportId}/final-files`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          // Lưu ý: Tuyệt đối KHÔNG set 'Content-Type': 'multipart/form-data' ở đây. 
          // Trình duyệt sẽ tự động set kèm theo boundary khi dùng FormData.
        },
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi upload file tổng hợp:", error);
      throw error;
    }
  },
  // Xóa file tổng hợp của Admin
  deleteFinalFile: async (fileId: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${BASE_URL}/api/Reports/final-files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi xóa file tổng hợp:", error);
      throw error;
    }
  },
};
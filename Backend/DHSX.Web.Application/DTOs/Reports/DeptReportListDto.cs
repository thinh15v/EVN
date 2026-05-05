using System;

namespace DHSX.Web.Application.DTOs.Reports
{
    public class DeptReportListDto
    {
        public int ReportId { get; set; }
        public string ReportCode { get; set; }
        public string ReportName { get; set; }
        public DateTime Deadline { get; set; }

        // Thông tin phân công riêng của Ban này
        public int AssignmentId { get; set; }
        public string AssignStatus { get; set; } // Ví dụ: "Chưa cập nhật", "Đã cập nhật", "Đã xác nhận"
        public bool IsLocked { get; set; } // 1 là không cho upload nữa
    }
}
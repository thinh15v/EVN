// Thêm DTO mới cho phần upload
// File: UploadReportFileDto.cs
using Microsoft.AspNetCore.Http;

namespace DHSX.Web.Application.DTOs.Reports
{
    public class UploadReportFileDto
    {
        public int ReportId { get; set; }
        public int DeptId { get; set; }
        public int UserId { get; set; }
        public string Note { get; set; }
        public IFormFile File { get; set; } // Hứng file từ Frontend gửi lên
        public string UserFullName { get; set; }
        public string UserPosition { get; set; }
        public string UserDeptName { get; set; }

    }
}
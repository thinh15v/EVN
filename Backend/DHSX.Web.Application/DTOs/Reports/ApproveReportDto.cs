// File: ApproveReportDto.cs
namespace DHSX.Web.Application.DTOs.Reports
{
    public class ApproveReportDto
    {
        public int AssignmentId { get; set; } // ID phân công của Ban đó
        public int SelectedVersionId { get; set; } // ID của file báo cáo được Lãnh đạo chọn làm bản chốt

        // Thông tin người duyệt (truyền từ Frontend sau khi giải mã Token)
        public int UserId { get; set; }
        public string UserFullName { get; set; }
        public string UserPosition { get; set; }
        public string UserDeptName { get; set; }
    }
}
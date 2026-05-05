namespace DHSX.Web.Application.DTOs.Reports
{
    public class UnlockAssignmentDto
    {
        public int AssignmentId { get; set; }
        public string Reason { get; set; } // Lý do mở khóa để lưu vào Timeline

        // Thông tin Admin thực hiện
        public int UserId { get; set; }
        public string UserFullName { get; set; }
        public string UserPosition { get; set; }
        public string UserDeptName { get; set; }
    }
}
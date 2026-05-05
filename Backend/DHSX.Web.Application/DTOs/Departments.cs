namespace DHSX.Web.Application.DTOs.Departments
{
    // DTO để trả dữ liệu về cho Frontend
    public class DepartmentResponseDto
    {
        public decimal DeptId { get; set; }
        public string DeptCode { get; set; }
        public string DeptName { get; set; }
        public string Description { get; set; }
    }

    // DTO để nhận dữ liệu khi Tạo mới / Cập nhật
    public class DepartmentRequestDto
    {
        public string DeptCode { get; set; }
        public string DeptName { get; set; }
        public string Description { get; set; }
    }
}
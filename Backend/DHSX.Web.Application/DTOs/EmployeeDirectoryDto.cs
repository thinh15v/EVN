// File: EmployeeDirectoryDto.cs
namespace DHSX.Web.Application.DTOs.External
{
    public class EmployeeDirectoryDto
    {
        public string Msnv { get; set; }
        public string HoTen { get; set; }
        public string ChucVu { get; set; }
        public string PhongBan { get; set; }
        public string Email { get; set; }

        // (Bạn có thể thêm các trường khác nếu API trả về và bạn muốn dùng sau này)
    }
}
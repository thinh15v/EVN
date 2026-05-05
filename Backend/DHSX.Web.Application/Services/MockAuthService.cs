using System;
using System.Collections.Generic;
using System.Linq;
using DHSX.Web.Application.DTOs.Auth;
using DHSX.Web.Application.Interfaces;
using DHSX.Web.Domain.Entities;

namespace DHSX.Web.Application.Services
{
    public class MockAuthService : IAuthService
    {
        public LoginResponseDto Login(LoginRequestDto request)
        {
            // 1. Tạo sẵn vài Phòng Ban giả lập
            var deptKeHoach = new Department { DeptId = 1, DeptCode = "B01", DeptName = "Ban Kế hoạch" };
            var deptKyThuat = new Department { DeptId = 2, DeptCode = "B02", DeptName = "Ban Kỹ thuật" };

            // 2. Tạo sẵn danh sách Users giả lập (Giống với demo React của chúng ta)
            var mockUsers = new List<LoginResponseDto>
            {
                new LoginResponseDto { UserId = 1, Username = "admin", FullName = "Admin Hệ Thống", Role = "ADMIN", Department = null },
                new LoginResponseDto { UserId = 2, Username = "lanhdaob02", FullName = "LĐ. Trần Thị C", Role = "LANH_DAO", Department = deptKyThuat },
                new LoginResponseDto { UserId = 3, Username = "nhanvienb02", FullName = "NV. Nguyễn Văn B", Role = "NHAN_VIEN", Department = deptKyThuat },
                new LoginResponseDto { UserId = 4, Username = "nhanvienb01", FullName = "NV. Lê Văn D", Role = "NHAN_VIEN", Department = deptKeHoach }
            };

            // 3. Tìm user theo Username (bỏ qua mật khẩu để test nhanh)
            var user = mockUsers.FirstOrDefault(u => u.Username.ToLower() == request.Username?.ToLower());

            if (user != null)
            {
                // Giả lập tạo một chuỗi JWT Token
                user.Token = $"fake-jwt-token-for-{user.Username}-{Guid.NewGuid()}";
                return user;
            }

            throw new Exception("Tài khoản không tồn tại! Vui lòng dùng: admin, lanhdaob02, nhanvienb02, nhanvienb01");
        }
    }
}
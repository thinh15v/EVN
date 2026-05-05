using DHSX.Web.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSX.Web.Application.DTOs.Auth
{
    public class LoginResponseDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public string Token { get; set; } // Sẽ chứa Fake Token

        // Chứa luôn thông tin phòng ban của User đó
        public Department Department { get; set; }
    }
}

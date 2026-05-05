using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSX.Web.Application.DTOs.Auth
{
    public class LoginRequestDto
    {
        public string Username { get; set; }
        // Tạm thời chưa cần kiểm tra Password thực tế
        public string Password { get; set; }
    }
}

using Microsoft.AspNetCore.Mvc;
using DHSX.Web.Application.DTOs.Auth;
using System;
using DHSX.Web.Application.Interfaces;

namespace DHSX.Web.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var result = _authService.Login(request);

                // Trả về HTTP 200 OK cùng dữ liệu
                return Ok(new
                {
                    success = true,
                    message = "Đăng nhập thành công",
                    data = result
                });
            }
            catch (Exception ex)
            {
                // Trả về HTTP 400 Bad Request nếu user không tồn tại
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}
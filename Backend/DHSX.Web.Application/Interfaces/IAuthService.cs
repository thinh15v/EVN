using DHSX.Web.Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSX.Web.Application.Interfaces
{
    public interface IAuthService
    {
        LoginResponseDto Login(LoginRequestDto request);
    }
}

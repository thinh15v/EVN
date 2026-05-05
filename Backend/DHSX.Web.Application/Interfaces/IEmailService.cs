// File: IEmailService.cs
using System.Threading.Tasks;

namespace DHSX.Web.Application.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string subject, string body);
    }
}
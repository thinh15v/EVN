// File: EmailService.cs
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using DHSX.Web.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace DHSX.Web.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly HttpClient _httpClient;
        private readonly string _emailApiUrl;

        // Tiêm HttpClient và Configuration vào
        public EmailService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            // Lấy đường dẫn API gửi mail của bạn từ file appsettings.json
            _emailApiUrl = configuration["ExternalApis:EmailApiUrl"];
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                // Cấu trúc JSON này bạn hãy sửa lại cho ĐÚNG VỚI API CỦA BẠN đang yêu cầu nhé
                var payload = new
                {
                    To = toEmail,
                    Subject = subject,
                    Content = body
                };

                // Gọi POST request đến API của bạn
                var response = await _httpClient.PostAsJsonAsync(_emailApiUrl, payload);

                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu gọi API thất bại
                Console.WriteLine($"Lỗi gửi mail: {ex.Message}");
                return false;
            }
        }
    }
}
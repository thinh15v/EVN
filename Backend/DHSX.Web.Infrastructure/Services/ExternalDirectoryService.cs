// File: ExternalDirectoryService.cs
using DHSX.Web.Application.DTOs.External;
using DHSX.Web.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace DHSX.Web.Infrastructure.Services
{
    public class ExternalDirectoryService : IExternalDirectoryService
    {
        private readonly HttpClient _httpClient;
        private readonly string _directoryApiUrl;

        public ExternalDirectoryService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            // Lấy URL cấu hình từ appsettings
            _directoryApiUrl = configuration["ExternalApis:DirectoryApiUrl"];
        }

        public async Task<List<string>> GetEmailsByDeptIdAsync(int deptId)
        {
            try
            {
                // Gọi API lấy danh sách email. 
                // Lưu ý: Đổi tham số "?deptId=" theo đúng định dạng API thực tế của bạn
                string url = $"{_directoryApiUrl}?deptId={deptId}";

                // 1. Hứng dữ liệu thông qua class Wrapper BaseApiResponse
                var response = await _httpClient.GetFromJsonAsync<BaseApiResponse<List<EmployeeDirectoryDto>>>(url);

                // 2. Kiểm tra xem gọi API có thành công (Success == true) và có Data không
                if (response != null && response.Success && response.Data != null && response.Data.Any())
                {
                    var emails = response.Data
                        .Where(emp => !string.IsNullOrWhiteSpace(emp.Email))
                        .Select(emp => emp.Email)
                        .ToList();

                    return emails;
                } 
                return new List<string>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi lấy danh sách email cho Ban {deptId}: {ex.Message}");
                return new List<string>(); // Trả về danh sách rỗng để không làm crash luồng chính
            }
        }
    }
}
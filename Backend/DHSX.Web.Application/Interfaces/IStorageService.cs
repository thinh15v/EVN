// File: IStorageService.cs (Trong DHSX.Web.Application)
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace DHSX.Web.Application.Interfaces
{
    public interface IStorageService
    {
        // Upload file và trả về tên file/đường dẫn đã lưu
        Task<string> UploadFileAsync(IFormFile file, string folderPrefix);
        Task<string> GetPresignedUrlAsync(string objectName, int expiryMinutes = 60);
    }
}
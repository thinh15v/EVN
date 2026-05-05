// File: BaseApiResponse.cs
namespace DHSX.Web.Application.DTOs.External
{
    // Chữ <T> giúp class này có thể bọc bất kỳ loại dữ liệu nào (List, Object, string...)
    public class BaseApiResponse<T>
    {
        public bool Success { get; set; }
        public T Data { get; set; }

        // Bạn có thể thêm các trường khác nếu API của bạn có (VD: Message, ErrorCode...)
        public string Message { get; set; }
    }
}
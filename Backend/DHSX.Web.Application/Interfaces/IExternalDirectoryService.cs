// File: IExternalDirectoryService.cs
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DHSX.Web.Application.Interfaces
{
    public interface IExternalDirectoryService
    {
        // Trả về danh sách chứa 1 hoặc nhiều email theo DeptId
        Task<List<string>> GetEmailsByDeptIdAsync(int deptId);
    }
}
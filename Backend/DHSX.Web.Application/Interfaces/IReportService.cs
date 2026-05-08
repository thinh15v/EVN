using System.Threading.Tasks;
using DHSX.Web.Application.DTOs.Reports;
using Microsoft.AspNetCore.Http;
namespace DHSX.Web.Application.Interfaces
{
    public interface IReportService
    {
        Task<object> GetReportDetailForAdminAsync(int reportId);
        Task<bool> CreateReportAsync(CreateReportRequestDto request);
        Task<bool> UploadReportFileAsync(UploadReportFileDto request);
        Task<IEnumerable<ReportListDto>> GetReportsAsync();
        Task<ReportTimelineDto> GetReportTimelineAsync(int reportId);
        Task<bool> ApproveAndLockReportAsync(ApproveReportDto request);

        // Mở khóa phân công
        Task<bool> UnlockAssignmentAsync(UnlockAssignmentDto request);

        // Upload file tổng hợp của Admin
        Task<bool> UploadFinalFileAsync(int reportId, IFormFile file);

        // Xóa file tổng hợp
        Task<bool> DeleteFinalFileAsync(int fileId);
        
        // Lấy danh sách báo cáo theo Ban
        Task<IEnumerable<DeptReportListDto>> GetReportsByDeptAsync(int deptId);
        
        // Khóa tất cả phân công của một báo cáo
        Task<bool> LockAllAssignmentsAsync(int reportId);

        // Cập nhật phân công cho một báo cáo
        Task<bool> UpdateAssignmentsAsync(int reportId, List<int> departmentIds);

        Task<IEnumerable<ReportVersionDto>> GetReportVersionsAsync(int reportId, int deptId);

    }
}
using System.Threading.Tasks;
using DHSX.Web.Application.DTOs.Reports;
using Microsoft.AspNetCore.Http;
namespace DHSX.Web.Application.Interfaces
{
    public interface IReportService
    {
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
        Task<IEnumerable<DeptReportListDto>> GetReportsByDeptAsync(int deptId);

    }
}
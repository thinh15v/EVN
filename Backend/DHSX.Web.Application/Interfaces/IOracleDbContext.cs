// File: IOracleDbContext.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Threading;
using System.Threading.Tasks;
using DHSX.Web.Domain.Entities; // Tham chiếu đến các file entity

namespace DHSX.Web.Application.Interfaces
{
    public interface IOracleDbContext
    {
        // Liệt kê các bảng mà Application cần dùng
        DbSet<Department> Departments { get; set; }
        DbSet<Report> Reports { get; set; }
        DbSet<ReportAssignment> ReportAssignments { get; set; }
        DbSet<ReportVersion> ReportVersions { get; set; }
        DbSet<ReportTimeline> ReportTimelines { get; set; }

        DbSet<ReportFinalFile> ReportFinalFiles { get; set; }

        // Bắt buộc phải có 2 cái này để dùng Transaction và SaveChanges
        DatabaseFacade Database { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
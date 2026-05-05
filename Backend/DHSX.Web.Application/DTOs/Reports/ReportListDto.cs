// File: ReportListDto.cs
using System;

namespace DHSX.Web.Application.DTOs.Reports
{
    public class ReportListDto
    {
        public int ReportId { get; set; }
        public string ReportCode { get; set; }
        public string ReportType { get; set; }
        public string ReportName { get; set; }
        public DateTime Deadline { get; set; }
        public string GlobalStatus { get; set; }

        // Hai trường này dùng để tính tiến độ (Ví dụ: 1/3 Ban hoàn thành)
        public int TotalAssigned { get; set; }
        public int TotalCompleted { get; set; }
    }
}
using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class Report
{
    public decimal ReportId { get; set; }

    public string ReportCode { get; set; } = null!;

    public string ReportType { get; set; } = null!;

    public string ReportName { get; set; } = null!;

    public DateTime Deadline { get; set; }

    public string? GlobalStatus { get; set; }

    public decimal CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? FinalFilePath { get; set; }

    public virtual ICollection<ReportAssignment> ReportAssignments { get; set; } = new List<ReportAssignment>();

    public virtual ICollection<ReportFinalFile> ReportFinalFiles { get; set; } = new List<ReportFinalFile>();

    public virtual ICollection<ReportTimeline> ReportTimelines { get; set; } = new List<ReportTimeline>();
}

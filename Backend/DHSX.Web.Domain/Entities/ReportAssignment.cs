using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class ReportAssignment
{
    public decimal AssignmentId { get; set; }

    public decimal ReportId { get; set; }

    public decimal DeptId { get; set; }

    public string? AssignStatus { get; set; }

    public bool? IsLocked { get; set; }

    public decimal? ConfirmedBy { get; set; }

    public DateTime? ConfirmedAt { get; set; }

    public virtual Department Dept { get; set; } = null!;

    public virtual Report Report { get; set; } = null!;

    public virtual ICollection<ReportVersion> ReportVersions { get; set; } = new List<ReportVersion>();
}

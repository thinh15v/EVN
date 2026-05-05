using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class Department
{
    public decimal DeptId { get; set; }

    public string DeptCode { get; set; } = null!;

    public string DeptName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<ReportAssignment> ReportAssignments { get; set; } = new List<ReportAssignment>();

    public virtual ICollection<ReportTimeline> ReportTimelines { get; set; } = new List<ReportTimeline>();
}

using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class ReportTimeline
{
    public decimal TimelineId { get; set; }

    public decimal ReportId { get; set; }

    public decimal? DeptId { get; set; }

    public decimal UserId { get; set; }

    public string ActionType { get; set; } = null!;

    public string? ActionDetail { get; set; }

    public DateTime? ActionTime { get; set; }

    public string? UserFullname { get; set; }

    public string? UserPosition { get; set; }

    public string? UserDeptName { get; set; }

    public virtual Department? Dept { get; set; }

    public virtual Report Report { get; set; } = null!;
}

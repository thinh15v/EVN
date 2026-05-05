using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class RollingPlan
{
    public decimal? Instid { get; set; }

    public decimal? Batchid { get; set; }

    public decimal? Directid { get; set; }

    public decimal? Taskid { get; set; }

    public decimal? Revision { get; set; }

    public decimal? Phase { get; set; }

    public decimal? Status { get; set; }

    public decimal? Progress { get; set; }

    public decimal? Source { get; set; }

    public decimal? Target { get; set; }

    public decimal? Rflags { get; set; }

    public decimal? Opcode { get; set; }

    public string? P1 { get; set; }

    public string? P2 { get; set; }

    public string? P3 { get; set; }

    public string? P4 { get; set; }

    public string? Description { get; set; }

    public decimal? ExecStatus { get; set; }

    public string? ExecInfo { get; set; }

    public DateTime? ExecTime { get; set; }

    public DateTime? FinishTime { get; set; }

    public decimal? PostStatus { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

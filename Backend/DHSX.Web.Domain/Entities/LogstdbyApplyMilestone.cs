using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogstdbyApplyMilestone
{
    public decimal SessionId { get; set; }

    public decimal CommitScn { get; set; }

    public DateTime? CommitTime { get; set; }

    public decimal SynchScn { get; set; }

    public decimal Epoch { get; set; }

    public decimal ProcessedScn { get; set; }

    public DateTime? ProcessedTime { get; set; }

    public decimal FetchlwmScn { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }

    public decimal? Flags { get; set; }

    public DateTime? LwmUpdTime { get; set; }

    public decimal? Spare4 { get; set; }

    public decimal? Spare5 { get; set; }

    public decimal? Spare6 { get; set; }

    public DateTime? Spare7 { get; set; }

    public decimal? PtoRecoveryScn { get; set; }

    public decimal? PtoRecoveryIncarnation { get; set; }
}

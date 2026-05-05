using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrSession
{
    public decimal Session { get; set; }

    public decimal? Client { get; set; }

    public string SessionName { get; set; } = null!;

    public decimal? DbId { get; set; }

    public decimal? ResetlogsChange { get; set; }

    public decimal? SessionAttr { get; set; }

    public string? SessionAttrVerbose { get; set; }

    public decimal? StartScn { get; set; }

    public decimal? EndScn { get; set; }

    public decimal? SpillScn { get; set; }

    public DateTime? SpillTime { get; set; }

    public decimal? OldestScn { get; set; }

    public decimal? ResumeScn { get; set; }

    public string? GlobalDbName { get; set; }

    public decimal? ResetTimestamp { get; set; }

    public decimal? BranchScn { get; set; }

    public string? Version { get; set; }

    public string? RedoCompat { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? PurgeScn { get; set; }

    public decimal? Spare3 { get; set; }

    public decimal? Spare4 { get; set; }

    public decimal? Spare5 { get; set; }

    public DateTime? Spare6 { get; set; }

    public string? Spare7 { get; set; }

    public string? Spare8 { get; set; }

    public decimal? Spare9 { get; set; }
}

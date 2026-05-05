using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogstdbyEvent
{
    public DateTime EventTime { get; set; }

    public decimal? CurrentScn { get; set; }

    public decimal? CommitScn { get; set; }

    public decimal? Xidusn { get; set; }

    public decimal? Xidslt { get; set; }

    public decimal? Xidsqn { get; set; }

    public decimal? Errval { get; set; }

    public string? Event { get; set; }

    public string? FullEvent { get; set; }

    public string? Error { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }

    public string? ConName { get; set; }

    public decimal? ConId { get; set; }
}

using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogstdbyHistory
{
    public decimal? StreamSequence { get; set; }

    public decimal? LmnrSid { get; set; }

    public decimal? Dbid { get; set; }

    public decimal? FirstChange { get; set; }

    public decimal? LastChange { get; set; }

    public decimal? Source { get; set; }

    public decimal? Status { get; set; }

    public DateTime? FirstTime { get; set; }

    public DateTime? LastTime { get; set; }

    public string? Dgname { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

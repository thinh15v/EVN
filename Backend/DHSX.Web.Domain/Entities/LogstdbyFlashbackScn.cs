using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogstdbyFlashbackScn
{
    public decimal PrimaryScn { get; set; }

    public DateTime? PrimaryTime { get; set; }

    public decimal? StandbyScn { get; set; }

    public DateTime? StandbyTime { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public DateTime? Spare3 { get; set; }
}

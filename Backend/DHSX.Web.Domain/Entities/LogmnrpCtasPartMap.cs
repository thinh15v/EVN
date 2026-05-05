using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrpCtasPartMap
{
    public decimal LogmnrUid { get; set; }

    public decimal Baseobj { get; set; }

    public decimal Baseobjv { get; set; }

    public decimal Keyobj { get; set; }

    public decimal Part { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

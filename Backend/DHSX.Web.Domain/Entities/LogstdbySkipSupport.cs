using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogstdbySkipSupport
{
    public decimal Action { get; set; }

    public string Name { get; set; } = null!;

    public string? Name2 { get; set; }

    public string? Name3 { get; set; }

    public string? Name4 { get; set; }

    public string? Name5 { get; set; }

    public decimal? Reg { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

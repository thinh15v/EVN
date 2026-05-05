using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrParameter
{
    public decimal Session { get; set; }

    public string Name { get; set; } = null!;

    public string? Value { get; set; }

    public decimal? Type { get; set; }

    public decimal? Scn { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

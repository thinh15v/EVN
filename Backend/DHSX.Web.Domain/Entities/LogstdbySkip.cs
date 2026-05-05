using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogstdbySkip
{
    public decimal? Error { get; set; }

    public string? StatementOpt { get; set; }

    public string? Schema { get; set; }

    public string? Name { get; set; }

    public decimal? UseLike { get; set; }

    public string? Esc { get; set; }

    public string? Proc { get; set; }

    public decimal? Active { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

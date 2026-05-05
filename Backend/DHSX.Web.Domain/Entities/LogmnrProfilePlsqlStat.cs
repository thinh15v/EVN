using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrProfilePlsqlStat
{
    public string Pkgowner { get; set; } = null!;

    public string Pkgname { get; set; } = null!;

    public decimal Name { get; set; }

    public decimal? Pragmaop { get; set; }

    public decimal? Opnum { get; set; }

    public decimal? Tlsbyunsuppopnum { get; set; }

    public decimal? Oggunsuppopnum { get; set; }

    public decimal? Redosize { get; set; }

    public decimal? Redorate { get; set; }

    public string? Spare1 { get; set; }

    public string? Spare2 { get; set; }

    public decimal? Spare3 { get; set; }

    public decimal? Spare4 { get; set; }

    public decimal? Spare5 { get; set; }

    public decimal? Spare6 { get; set; }
}

using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class RollingStatistic
{
    public decimal? Statid { get; set; }

    public decimal? Rdbid { get; set; }

    public decimal? Attributes { get; set; }

    public decimal? Type { get; set; }

    public string? Name { get; set; }

    public string? Valuestr { get; set; }

    public decimal? Valuenum { get; set; }

    public DateTime? Valuets { get; set; }

    public TimeSpan? Valueint { get; set; }

    public DateTime? UpdateTime { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

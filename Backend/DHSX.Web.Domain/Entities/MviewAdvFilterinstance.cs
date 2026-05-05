using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Table for workload filter instance definition
/// </summary>
public partial class MviewAdvFilterinstance
{
    public decimal Runid { get; set; }

    public decimal? Filterid { get; set; }

    public decimal? Subfilternum { get; set; }

    public decimal? Subfiltertype { get; set; }

    public string? StrValue { get; set; }

    public decimal? NumValue1 { get; set; }

    public decimal? NumValue2 { get; set; }

    public DateTime? DateValue1 { get; set; }

    public DateTime? DateValue2 { get; set; }

    public virtual MviewAdvLog Run { get; set; } = null!;
}

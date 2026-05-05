using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Table for workload filter definition
/// </summary>
public partial class MviewAdvFilter
{
    public decimal Filterid { get; set; }

    public decimal Subfilternum { get; set; }

    public decimal Subfiltertype { get; set; }

    public string? StrValue { get; set; }

    public decimal? NumValue1 { get; set; }

    public decimal? NumValue2 { get; set; }

    public DateTime? DateValue1 { get; set; }

    public DateTime? DateValue2 { get; set; }
}

using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class MviewFilter
{
    public decimal Filterid { get; set; }

    public decimal Subfilternum { get; set; }

    public string? Subfiltertype { get; set; }

    public string? StrValue { get; set; }

    public decimal? NumValue1 { get; set; }

    public decimal? NumValue2 { get; set; }

    public DateTime? DateValue1 { get; set; }

    public DateTime? DateValue2 { get; set; }
}

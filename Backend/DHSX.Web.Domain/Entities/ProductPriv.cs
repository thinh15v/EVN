using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class ProductPriv
{
    public string Product { get; set; } = null!;

    public string? Userid { get; set; }

    public string? Attribute { get; set; }

    public string? Scope { get; set; }

    public decimal? NumericValue { get; set; }

    public string? CharValue { get; set; }

    public DateTime? DateValue { get; set; }

    public string? LongValue { get; set; }
}

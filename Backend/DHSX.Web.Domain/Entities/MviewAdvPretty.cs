using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Table for sql parsing
/// </summary>
public partial class MviewAdvPretty
{
    public decimal? Queryid { get; set; }

    public string? SqlText { get; set; }
}

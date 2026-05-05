using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Table for temporary data
/// </summary>
public partial class MviewAdvTemp
{
    public decimal? Id { get; set; }

    public decimal? Seq { get; set; }

    public string? Text { get; set; }
}

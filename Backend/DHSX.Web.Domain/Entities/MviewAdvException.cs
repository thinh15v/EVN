using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Output table for dimension validations
/// </summary>
public partial class MviewAdvException
{
    public decimal? Runid { get; set; }

    public string? Owner { get; set; }

    public string? TableName { get; set; }

    public string? DimensionName { get; set; }

    public string? Relationship { get; set; }

    public string? BadRowid { get; set; }

    public virtual MviewAdvLog? Run { get; set; }
}

using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Summary advisor tuning parameters
/// </summary>
public partial class MviewAdvParameter
{
    public string ParameterName { get; set; } = null!;

    public decimal ParameterType { get; set; }

    public string? StringValue { get; set; }

    public DateTime? DateValue { get; set; }

    public decimal? NumericalValue { get; set; }
}

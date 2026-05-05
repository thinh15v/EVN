using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Output table for summary recommendations and evaluations
/// </summary>
public partial class MviewAdvOutput
{
    public decimal Runid { get; set; }

    public decimal OutputType { get; set; }

    public decimal Rank { get; set; }

    public string? ActionType { get; set; }

    public string? SummaryOwner { get; set; }

    public string? SummaryName { get; set; }

    public string? GroupByColumns { get; set; }

    public string? WhereClause { get; set; }

    public string? FromClause { get; set; }

    public string? MeasuresList { get; set; }

    public string? FactTables { get; set; }

    public string? GroupingLevels { get; set; }

    public decimal? Querylen { get; set; }

    public string? QueryText { get; set; }

    public decimal? StorageInBytes { get; set; }

    public decimal? PctPerformanceGain { get; set; }

    public decimal? Frequency { get; set; }

    public decimal? CumulativeBenefit { get; set; }

    public decimal BenefitToCostRatio { get; set; }

    public decimal? Validated { get; set; }

    public virtual MviewAdvLog Run { get; set; } = null!;
}

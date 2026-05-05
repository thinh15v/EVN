using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class MviewRecommendation
{
    public decimal Runid { get; set; }

    public string? AllTables { get; set; }

    public string? FactTables { get; set; }

    public string? GroupingLevels { get; set; }

    public string? QueryText { get; set; }

    public decimal RecommendationNumber { get; set; }

    public string? RecommendedAction { get; set; }

    public string? MviewOwner { get; set; }

    public string? MviewName { get; set; }

    public decimal? StorageInBytes { get; set; }

    public decimal? PctPerformanceGain { get; set; }

    public decimal BenefitToCostRatio { get; set; }
}

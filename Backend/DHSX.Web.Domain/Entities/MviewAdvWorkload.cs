using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Shared workload repository for DBA users of summary advisor
/// </summary>
public partial class MviewAdvWorkload
{
    public decimal Queryid { get; set; }

    public decimal Collectionid { get; set; }

    public DateTime Collecttime { get; set; }

    public string? Application { get; set; }

    public decimal? Cardinality { get; set; }

    public decimal? Resultsize { get; set; }

    public string Uname { get; set; } = null!;

    public DateTime? Qdate { get; set; }

    public decimal? Priority { get; set; }

    public decimal? ExecTime { get; set; }

    public string SqlText { get; set; } = null!;

    public decimal SqlTextlen { get; set; }

    public decimal? SqlHash { get; set; }

    public Guid? SqlAddr { get; set; }

    public decimal? Frequency { get; set; }
}

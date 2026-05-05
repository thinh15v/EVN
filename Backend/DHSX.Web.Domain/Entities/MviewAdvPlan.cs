using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Private plan table for estimate_mview_size operations
/// </summary>
public partial class MviewAdvPlan
{
    public string? StatementId { get; set; }

    public DateTime? Timestamp { get; set; }

    public string? Remarks { get; set; }

    public string? Operation { get; set; }

    public string? Options { get; set; }

    public string? ObjectNode { get; set; }

    public string? ObjectOwner { get; set; }

    public string? ObjectName { get; set; }

    public decimal? ObjectInstance { get; set; }

    public string? ObjectType { get; set; }

    public string? Optimizer { get; set; }

    public decimal? SearchColumns { get; set; }

    public decimal? Id { get; set; }

    public decimal? ParentId { get; set; }

    public decimal? Position { get; set; }

    public decimal? Cost { get; set; }

    public decimal? Cardinality { get; set; }

    public decimal? Bytes { get; set; }

    public string? OtherTag { get; set; }

    public string? PartitionStart { get; set; }

    public string? PartitionStop { get; set; }

    public decimal? PartitionId { get; set; }

    public string? Other { get; set; }

    public string? Distribution { get; set; }

    public decimal? CpuCost { get; set; }

    public decimal? IoCost { get; set; }

    public decimal? TempSpace { get; set; }
}

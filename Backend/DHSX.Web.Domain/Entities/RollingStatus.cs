using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class RollingStatus
{
    public decimal? Revision { get; set; }

    public decimal? Phase { get; set; }

    public decimal? Batchid { get; set; }

    public decimal? Status { get; set; }

    public decimal? Coordid { get; set; }

    public decimal? Oprimary { get; set; }

    public decimal? Fprimary { get; set; }

    public decimal? Pid { get; set; }

    public decimal? Instance { get; set; }

    public decimal? Dbtotal { get; set; }

    public decimal? Dbactive { get; set; }

    public string? Location { get; set; }

    public DateTime? InitTime { get; set; }

    public DateTime? BuildTime { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? SwitchTime { get; set; }

    public DateTime? FinishTime { get; set; }

    public decimal? LastInstid { get; set; }

    public decimal? LastBatchid { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class RollingEvent
{
    public decimal? Eventid { get; set; }

    public decimal? Instid { get; set; }

    public decimal? Revision { get; set; }

    public DateTime? EventTime { get; set; }

    public string? Type { get; set; }

    public decimal? Status { get; set; }

    public string? Message { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

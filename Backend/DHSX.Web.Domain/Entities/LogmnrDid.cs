using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrDid
{
    public decimal Session { get; set; }

    public decimal? LogmnrDid1 { get; set; }

    public decimal? Flags { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }

    public DateTime? Spare4 { get; set; }
}

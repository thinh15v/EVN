using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrcTspart
{
    public decimal LogmnrUid { get; set; }

    public decimal Obj { get; set; }

    public decimal Ts { get; set; }

    public decimal StartScn { get; set; }

    public decimal? DropScn { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}

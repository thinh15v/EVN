using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrcUser
{
    public decimal LogmnrUid { get; set; }

    public decimal User { get; set; }

    public decimal? Spare1 { get; set; }

    public string Name { get; set; } = null!;

    public decimal StartScn { get; set; }

    public decimal? DropScn { get; set; }

    public decimal? Spare1C { get; set; }

    public decimal? Spare2C { get; set; }

    public string? Spare3C { get; set; }
}
